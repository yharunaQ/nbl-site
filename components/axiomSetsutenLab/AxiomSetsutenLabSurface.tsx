import { useMemo, useState, type ReactNode } from 'react';
import {
  BrainCircuit,
  CheckCircle2,
  ClipboardList,
  FileJson,
  FileText,
  HelpCircle,
  Layers3,
  MessageSquareText,
  ShieldCheck,
  Upload,
  type LucideIcon,
} from 'lucide-react';
import {
  AXIOM_SETSUTEN_AI_ALLOWED,
  AXIOM_SETSUTEN_AI_FORBIDDEN,
  AXIOM_SETSUTEN_BOUNDARY_LABELS,
  AXIOM_SETSUTEN_QUESTION_MODES,
  AXIOM_SETSUTEN_SCENARIOS,
  buildAxiomSetsutenReviewPacket,
  getAxiomSetsutenScenarioById,
  getVisibleAxiomSetsutenNodes,
  type AxiomSetsutenLensId,
  type AxiomSetsutenQuestionModeId,
  type AxiomSetsutenScenario,
} from '@/lib/axiomSetsutenLab/axiomSetsutenLab';

type SetsutenTab = 'receive' | 'read' | 'memo' | 'ai';

const TABS: Array<{ id: SetsutenTab; label: string; icon: LucideIcon }> = [
  { id: 'receive', label: '受け取る', icon: Upload },
  { id: 'read', label: '読む', icon: Layers3 },
  { id: 'memo', label: '相談メモ', icon: ClipboardList },
  { id: 'ai', label: 'AI用', icon: FileJson },
];

const TAB_TITLES: Record<SetsutenTab, string> = {
  receive: '共有データ',
  read: '気になる点',
  memo: '相談メモ',
  ai: 'AI用メモ',
};

const LENS_TONES: Record<AxiomSetsutenLensId, string> = {
  person_record: 'border-sky-300 bg-sky-50 text-sky-950',
  work_design: 'border-amber-300 bg-amber-50 text-amber-950',
  support_review: 'border-pink-300 bg-pink-50 text-pink-950',
  health_time: 'border-emerald-300 bg-emerald-50 text-emerald-950',
  regional_coordination: 'border-violet-300 bg-violet-50 text-violet-950',
};

const STATUS_LABELS = {
  observed: '見えている',
  candidate: 'ありそう',
  unknown: '未確認',
  boundary: '要確認',
} as const;

function AppHeader({ tab }: { tab: SetsutenTab }) {
  return (
    <header className="sticky top-0 z-20 bg-[#2c4460] px-4 py-4 text-[#fdfaf2]">
      <h1 className="text-lg font-bold leading-7">セツテンLab</h1>
      <p className="mt-0.5 text-xs font-semibold text-[#d9e0ea]">{TAB_TITLES[tab]}</p>
    </header>
  );
}

function BottomTabs({
  activeTab,
  onChange,
}: {
  activeTab: SetsutenTab;
  onChange: (tab: SetsutenTab) => void;
}) {
  return (
    <nav className="fixed bottom-0 left-1/2 z-20 flex w-full max-w-[520px] -translate-x-1/2 border-t border-[#ddd6c4] bg-white pb-[env(safe-area-inset-bottom,0)]">
      {TABS.map(({ id, label, icon: Icon }) => {
        const selected = activeTab === id;

        return (
          <button
            key={id}
            type="button"
            aria-current={selected ? 'page' : undefined}
            onClick={() => onChange(id)}
            className={`flex min-h-14 flex-1 flex-col items-center justify-center gap-1 text-xs font-semibold ${
              selected ? 'text-[#2c4460]' : 'text-[#7c8798]'
            }`}
          >
            <Icon aria-hidden="true" className="h-5 w-5" />
            {label}
          </button>
        );
      })}
    </nav>
  );
}

function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-[14px] border border-[#e8e3d4] bg-white p-4 ${className}`}>
      {children}
    </section>
  );
}

function SectionHeading({ title, hint }: { title: string; hint?: string }) {
  return (
    <div>
      <h2 className="text-base font-bold text-[#22344d]">{title}</h2>
      {hint ? <p className="mt-1 text-sm leading-6 text-[#4a5a70]">{hint}</p> : null}
    </div>
  );
}

function ScenarioPicker({
  scenario,
  onSelectScenario,
}: {
  scenario: AxiomSetsutenScenario;
  onSelectScenario: (scenarioId: string) => void;
}) {
  return (
    <div className="grid gap-2" aria-label="共有データサンプル">
      {AXIOM_SETSUTEN_SCENARIOS.map((candidate) => {
        const selected = scenario.id === candidate.id;

        return (
          <button
            key={candidate.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onSelectScenario(candidate.id)}
            className={`min-h-11 rounded-lg border px-3 py-2 text-left text-sm font-semibold ${
              selected
                ? 'border-[#2c4460] bg-[#f0ece0] text-[#1a2a3d]'
                : 'border-[#ddd6c4] bg-white text-[#4a5a70]'
            }`}
          >
            {candidate.sharedData.purpose}
          </button>
        );
      })}
    </div>
  );
}

function ReceiveView({
  scenario,
  onSelectScenario,
}: {
  scenario: AxiomSetsutenScenario;
  onSelectScenario: (scenarioId: string) => void;
}) {
  return (
    <div className="grid gap-4">
      <Card>
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f0ece0] text-[#2c4460]">
            <FileText aria-hidden="true" className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <SectionHeading title="ナミノート共有データ" />
            <p className="mt-2 break-words text-sm font-semibold text-[#22344d]">
              {scenario.sharedData.fileLabel}
            </p>
            <p className="mt-1 text-sm leading-6 text-[#4a5a70]">{scenario.sharedData.purpose}</p>
          </div>
        </div>

        <dl className="mt-4 grid gap-2 text-sm">
          {[
            ['見せる相手', scenario.sharedData.audienceLabel],
            ['期間', scenario.sharedData.rangeLabel],
            ['含まれるノート', scenario.sharedData.includedNotes],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-[#e8e3d4] bg-[#fbfaf6] px-3 py-2">
              <dt className="text-xs font-semibold text-[#7c8798]">{label}</dt>
              <dd className="mt-0.5 font-semibold text-[#22344d]">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-4">
          <p className="text-xs font-semibold text-[#7c8798]">見せる項目</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {scenario.sharedData.includedItems.map((item) => (
              <span
                key={item}
                className="rounded-full border border-[#ddd6c4] bg-white px-3 py-1 text-xs font-semibold text-[#22344d]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <SectionHeading
          title="サンプルを切り替える"
          hint="今は実ファイルを読まず、共有データの形だけを確認します。"
        />
        <div className="mt-3">
          <ScenarioPicker scenario={scenario} onSelectScenario={onSelectScenario} />
        </div>
      </Card>
    </div>
  );
}

function ReadView({
  scenario,
  activeLensIds,
  onToggleLens,
}: {
  scenario: AxiomSetsutenScenario;
  activeLensIds: AxiomSetsutenLensId[];
  onToggleLens: (lensId: AxiomSetsutenLensId) => void;
}) {
  const active = new Set(activeLensIds);
  const visibleNodes = getVisibleAxiomSetsutenNodes(scenario, activeLensIds);
  const observedItems =
    scenario.reviewColumns.find((column) => column.id === 'observed')?.items ?? [];
  const structuralItems =
    scenario.reviewColumns.find((column) => column.id === 'structure')?.items ?? [];
  const counterItems =
    scenario.reviewColumns.find((column) => column.id === 'counter')?.items ?? [];

  return (
    <div className="grid gap-4">
      <Card>
        <SectionHeading title="まず見るところ" />
        <div className="mt-3 grid gap-2">
          {[
            { label: '見えていること', text: observedItems[0] },
            { label: 'ありそうな読み', text: structuralItems[0] },
            { label: '別の見方', text: counterItems[0] },
          ].map((item) => (
            <article
              key={item.label}
              className="rounded-lg border border-[#e8e3d4] bg-[#fbfaf6] p-3"
            >
              <p className="text-xs font-semibold text-[#7c8798]">{item.label}</p>
              <p className="mt-1 text-sm leading-6 text-[#22344d]">{item.text}</p>
            </article>
          ))}
        </div>
      </Card>

      <Card>
        <SectionHeading title="見る角度" hint="外すと、その角度のメモが一時的に隠れます。" />
        <div className="mt-3 grid grid-cols-2 gap-2">
          {scenario.lenses.map((lens) => (
            <button
              key={lens.id}
              type="button"
              aria-pressed={active.has(lens.id)}
              onClick={() => onToggleLens(lens.id)}
              className={`min-h-11 rounded-lg border px-3 py-2 text-left text-sm font-bold ${
                active.has(lens.id)
                  ? LENS_TONES[lens.id]
                  : 'border-[#ddd6c4] bg-white text-[#7c8798]'
              }`}
            >
              {lens.shortLabel}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <SectionHeading title="詳しく見るメモ" />
        <div className="mt-3 grid gap-2">
          {visibleNodes.map((node) => (
            <article key={node.id} className="rounded-lg border border-[#e8e3d4] bg-white p-3">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-bold text-[#22344d]">{node.label}</h3>
                <span className="rounded-full bg-[#f0ece0] px-2 py-1 text-xs font-bold text-[#4a5a70]">
                  {STATUS_LABELS[node.status]}
                </span>
              </div>
              <p className="mt-1 text-sm leading-6 text-[#4a5a70]">{node.description}</p>
            </article>
          ))}
        </div>
      </Card>
    </div>
  );
}

function MemoView({
  scenario,
  questionModeId,
  onSelectQuestionMode,
}: {
  scenario: AxiomSetsutenScenario;
  questionModeId: AxiomSetsutenQuestionModeId;
  onSelectQuestionMode: (mode: AxiomSetsutenQuestionModeId) => void;
}) {
  const nextItems = scenario.reviewColumns.find((column) => column.id === 'next')?.items ?? [];

  return (
    <div className="grid gap-4">
      <Card>
        <SectionHeading title="相談で聞くこと" />
        <div className="mt-3 grid grid-cols-2 gap-2">
          {AXIOM_SETSUTEN_QUESTION_MODES.map((mode) => (
            <button
              key={mode.id}
              type="button"
              aria-pressed={mode.id === questionModeId}
              onClick={() => onSelectQuestionMode(mode.id)}
              className={`min-h-11 rounded-lg border px-3 py-2 text-left text-sm font-bold ${
                mode.id === questionModeId
                  ? 'border-[#2c4460] bg-[#2c4460] text-[#fdfaf2]'
                  : 'border-[#ddd6c4] bg-white text-[#4a5a70]'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
        <ul className="mt-4 grid gap-2">
          {scenario.questionBank[questionModeId].map((question) => (
            <li
              key={question}
              className="rounded-lg border border-[#e8e3d4] bg-[#fbfaf6] p-3 text-sm leading-6"
            >
              {question}
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <SectionHeading title="共同レビュー用メモ" />
        <div className="mt-3 grid gap-2">
          {nextItems.map((item) => (
            <div key={item} className="flex gap-2 rounded-lg border border-[#e8e3d4] bg-white p-3">
              <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#3f6e57]" />
              <p className="text-sm leading-6 text-[#22344d]">{item}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function AiView({
  scenario,
  activeLensIds,
  questionModeId,
}: {
  scenario: AxiomSetsutenScenario;
  activeLensIds: AxiomSetsutenLensId[];
  questionModeId: AxiomSetsutenQuestionModeId;
}) {
  const packet = useMemo(
    () => buildAxiomSetsutenReviewPacket(scenario, activeLensIds, questionModeId),
    [scenario, activeLensIds, questionModeId],
  );

  return (
    <div className="grid gap-4">
      <Card>
        <SectionHeading
          title="AIに渡すメモ"
          hint="Codex、Cursor、Claude Codeなどで使うための構造化メモです。"
        />
        <pre className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap rounded-lg bg-[#1a2a3d] p-3 text-xs leading-6 text-[#fdfaf2] [overflow-wrap:anywhere]">
          {packet}
        </pre>
      </Card>

      <Card>
        <details>
          <summary className="cursor-pointer text-sm font-bold text-[#22344d]">
            境界を確認する
          </summary>
          <div className="mt-3 grid gap-3">
            <div>
              <p className="text-xs font-bold text-[#3f6e57]">AIがしてよいこと</p>
              <ul className="mt-2 grid gap-1 text-sm leading-6 text-[#4a5a70]">
                {AXIOM_SETSUTEN_AI_ALLOWED.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold text-[#8a3b1f]">AIがしないこと</p>
              <ul className="mt-2 grid gap-1 text-sm leading-6 text-[#4a5a70]">
                {AXIOM_SETSUTEN_AI_FORBIDDEN.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </details>
      </Card>
    </div>
  );
}

function AboutBoundary() {
  return (
    <details className="rounded-[14px] border border-[#e8e3d4] bg-white p-4">
      <summary className="cursor-pointer text-sm font-bold text-[#22344d]">
        このアプリについて
      </summary>
      <div className="mt-3 grid gap-2 text-sm leading-6 text-[#4a5a70]">
        <p>
          ナミノート共有データを受け取り、支援者との共同レビュー用に読み直すための内部プロトタイプです。
        </p>
        <p>{AXIOM_SETSUTEN_BOUNDARY_LABELS.join(' / ')}</p>
      </div>
    </details>
  );
}

export default function AxiomSetsutenLabSurface(): JSX.Element {
  const [tab, setTab] = useState<SetsutenTab>('receive');
  const [selectedScenarioId, setSelectedScenarioId] = useState(AXIOM_SETSUTEN_SCENARIOS[0].id);
  const [activeLensIds, setActiveLensIds] = useState<AxiomSetsutenLensId[]>(
    AXIOM_SETSUTEN_SCENARIOS[0].lenses.map((lens) => lens.id),
  );
  const [questionModeId, setQuestionModeId] = useState<AxiomSetsutenQuestionModeId>('time_contact');

  const scenario = getAxiomSetsutenScenarioById(selectedScenarioId);

  function handleSelectScenario(scenarioId: string) {
    const nextScenario = getAxiomSetsutenScenarioById(scenarioId);
    setSelectedScenarioId(scenarioId);
    setActiveLensIds(nextScenario.lenses.map((lens) => lens.id));
  }

  function handleToggleLens(lensId: AxiomSetsutenLensId) {
    setActiveLensIds((current) => {
      if (current.includes(lensId)) {
        return current.length === 1 ? current : current.filter((id) => id !== lensId);
      }

      return [...current, lensId];
    });
  }

  return (
    <>
      <style jsx global>{`
        .axiom-setsuten-simple,
        .axiom-setsuten-simple * {
          box-sizing: border-box;
          min-width: 0;
          overflow-wrap: anywhere;
        }

        .axiom-setsuten-simple button {
          cursor: pointer;
        }
      `}</style>
      <main className="axiom-setsuten-simple min-h-screen bg-[#f7f4ec] text-[#22344d]">
        <div className="mx-auto min-h-screen max-w-[520px] bg-[#f7f4ec]">
          <AppHeader tab={tab} />
          <div className="grid gap-4 px-4 py-4 pb-24">
            {tab === 'receive' ? (
              <ReceiveView scenario={scenario} onSelectScenario={handleSelectScenario} />
            ) : null}
            {tab === 'read' ? (
              <ReadView
                scenario={scenario}
                activeLensIds={activeLensIds}
                onToggleLens={handleToggleLens}
              />
            ) : null}
            {tab === 'memo' ? (
              <MemoView
                scenario={scenario}
                questionModeId={questionModeId}
                onSelectQuestionMode={setQuestionModeId}
              />
            ) : null}
            {tab === 'ai' ? (
              <AiView
                scenario={scenario}
                activeLensIds={activeLensIds}
                questionModeId={questionModeId}
              />
            ) : null}
            <AboutBoundary />
          </div>
          <BottomTabs activeTab={tab} onChange={setTab} />
        </div>
      </main>
    </>
  );
}
