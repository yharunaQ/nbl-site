import Link from 'next/link';
import PageSeo from '@/components/PageSeo';
import SiteNav from '@/components/SiteNav';

// Region-level Q1 rates from toku18 n=3,053 (supporter practice survey)
const REGION_DATA = [
  { region: '北海道・東北', q1Rate: 0.244, n: 505 },
  { region: '関東',         q1Rate: 0.230, n: 569 },
  { region: '近畿',         q1Rate: 0.223, n: 431 },
  { region: '中部',         q1Rate: 0.208, n: 649 },
  { region: '九州・沖縄',   q1Rate: 0.177, n: 481 },
  { region: '中国・四国',   q1Rate: 0.153, n: 413 },
];

// Prefecture Q1 rates — quartile tiers (Q1=16.0%, Q2=17.9%, Q3=22.6%)
// tier: 0=低(<Q1) 1=中低(Q1〜Q2) 2=中高(Q2〜Q3) 3=高(≥Q3)
const PREF_DATA = [
  { name: '北海道', rate: 0.330, tier: 3 }, { name: '青森', rate: 0.180, tier: 2 },
  { name: '岩手',   rate: 0.138, tier: 0 }, { name: '宮城', rate: 0.274, tier: 3 },
  { name: '秋田',   rate: 0.154, tier: 0 }, { name: '山形', rate: 0.211, tier: 2 },
  { name: '福島',   rate: 0.162, tier: 1 }, { name: '茨城', rate: 0.163, tier: 1 },
  { name: '栃木',   rate: 0.172, tier: 1 }, { name: '群馬', rate: 0.188, tier: 2 },
  { name: '埼玉',   rate: 0.267, tier: 3 }, { name: '千葉', rate: 0.200, tier: 2 },
  { name: '東京',   rate: 0.244, tier: 3 }, { name: '神奈川', rate: 0.261, tier: 3 },
  { name: '新潟',   rate: 0.161, tier: 1 }, { name: '富山', rate: 0.231, tier: 3 },
  { name: '石川',   rate: 0.117, tier: 0 }, { name: '福井', rate: 0.167, tier: 1 },
  { name: '山梨',   rate: 0.171, tier: 1 }, { name: '長野', rate: 0.226, tier: 3 },
  { name: '岐阜',   rate: 0.250, tier: 3 }, { name: '静岡', rate: 0.207, tier: 2 },
  { name: '愛知',   rate: 0.306, tier: 3 }, { name: '三重', rate: 0.118, tier: 0 },
  { name: '滋賀',   rate: 0.152, tier: 0 }, { name: '京都', rate: 0.327, tier: 3 },
  { name: '大阪',   rate: 0.280, tier: 3 }, { name: '兵庫', rate: 0.154, tier: 0 },
  { name: '奈良',   rate: 0.206, tier: 2 }, { name: '和歌山', rate: 0.171, tier: 1 },
  { name: '鳥取',   rate: 0.135, tier: 0 }, { name: '島根', rate: 0.098, tier: 0 },
  { name: '岡山',   rate: 0.115, tier: 0 }, { name: '広島', rate: 0.161, tier: 1 },
  { name: '山口',   rate: 0.225, tier: 2 }, { name: '徳島', rate: 0.211, tier: 2 },
  { name: '香川',   rate: 0.053, tier: 0 }, { name: '愛媛', rate: 0.188, tier: 2 },
  { name: '高知',   rate: 0.216, tier: 2 }, { name: '福岡', rate: 0.171, tier: 1 },
  { name: '佐賀',   rate: 0.160, tier: 1 }, { name: '長崎', rate: 0.179, tier: 2 },
  { name: '熊本',   rate: 0.169, tier: 1 }, { name: '大分', rate: 0.289, tier: 3 },
  { name: '宮崎',   rate: 0.222, tier: 2 }, { name: '鹿児島', rate: 0.100, tier: 0 },
  { name: '沖縄',   rate: 0.161, tier: 1 },
];

const TIER_CONFIG = [
  { label: '高',  threshold: '22.6%以上', bg: 'bg-teal-600',   text: 'text-white',     border: 'border-teal-700' },
  { label: '中高', threshold: '17.9〜22.5%', bg: 'bg-teal-300', text: 'text-teal-950',  border: 'border-teal-400' },
  { label: '中低', threshold: '16.0〜17.8%', bg: 'bg-slate-200', text: 'text-slate-700', border: 'border-slate-300' },
  { label: '低',  threshold: '15.9%以下', bg: 'bg-slate-100',   text: 'text-slate-500', border: 'border-slate-200' },
];

const BARRIERS = [
  {
    n: '01',
    title: '上司・職場文化',
    note: '最大の規定因子',
    body: '管理者が支援の優先度を低く置く組織では、意欲ある支援者も実施できません。支援者個人の問題ではなく、組織設計の問題です。',
  },
  {
    n: '02',
    title: '機関ミッション・法令理解',
    note: '',
    body: '「何のための機関か」という理解と関連法令の把握が弱い機関では、支援が「任意の取り組み」として扱われます。',
  },
  {
    n: '03',
    title: '業績評価基準',
    note: '',
    body: '就職件数など表面的な数字で評価される組織では、見えにくいが重要な支援（関係構築・環境調整・連携）が省略されます。',
  },
  {
    n: '04',
    title: '資金・報酬基準',
    note: '',
    body: '支援の質が報酬に反映されない制度構造が、深い支援を実施するインセンティブを弱めます。',
  },
  {
    n: '05',
    title: '専門職規範',
    note: '',
    body: '支援者コミュニティ内の「支援はこういうものだ」という規範が、新しい実践へのアップデートを阻む場合があります。',
  },
];

export default function KnowledgeEvidencePage() {
  return (
    <>
      <PageSeo
        title="データ・エビデンス | Next Being Lab"
        description="71.9%の支援者が実施できない理由、都道府県間の最大6倍格差——データが示す就労支援の構造的課題。"
        path="/knowledge/evidence"
      />

      <SiteNav />

      <main className="min-h-screen bg-[linear-gradient(180deg,#fffef8_0%,#f8fafc_55%)] text-slate-900">
        <div className="mx-auto max-w-3xl px-6 py-14">

          <nav className="text-xs text-slate-400">
            <Link href="/knowledge" className="hover:text-slate-700">実践知識</Link>
            <span className="mx-2">/</span>
            <span>データ・エビデンス</span>
          </nav>

          <header className="mt-6 max-w-2xl">
            <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-800">
              データ・エビデンス
            </span>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              71.9%と地域格差が示すもの
            </h1>
          </header>

          {/* Article 1: 71.9% */}
          <article className="mt-10 rounded-2xl border border-slate-200 bg-white p-7">
            <h2 className="text-xl font-semibold text-slate-900">
              71.9%の支援者が、意欲はあるのに実施できていない
            </h2>
            <p className="mt-1 text-sm text-slate-500">就労支援の実践格差は、支援者個人の問題ではない</p>

            <div className="mt-6 rounded-2xl border border-indigo-200 bg-indigo-50 px-6 py-4 text-center">
              <p className="text-4xl font-semibold text-indigo-900">71.9%</p>
              <p className="mt-1 text-sm text-slate-600">支援者が「意欲はあるが実施できていない」</p>
            </div>

            <div className="mt-6 text-sm leading-7 text-slate-700 space-y-3">
              <p>
                この数字は、支援者調査（n=3,588）から明らかになったものです。「支援者が頑張れば解決する」問題ではありません。実践の質を分けるのは、個人の熱意や能力ではなく、<strong>組織設計・職場環境・機関ネットワークの構造</strong>です。
              </p>
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold text-slate-800 mb-4">実施できない5つの障壁</p>
              <div className="space-y-3">
                {BARRIERS.map(({ n, title, note, body }) => (
                  <div key={n} className="flex gap-4 rounded-xl bg-slate-50 px-4 py-3">
                    <span className="shrink-0 text-xs font-semibold text-slate-400 mt-0.5">{n}</span>
                    <div>
                      <p className="font-semibold text-slate-800">
                        {title}
                        {note && <span className="ml-2 text-xs font-normal text-indigo-600">{note}</span>}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>

          {/* Article 2: Regional gap */}
          <article className="mt-6 rounded-2xl border border-slate-200 bg-white p-7">
            <h2 className="text-xl font-semibold text-slate-900">
              なぜ地域によって最大6倍の差があるのか
            </h2>
            <p className="mt-1 text-sm text-slate-500">格差の構造を理解する</p>

            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-4 text-center">
              <p className="text-4xl font-semibold text-amber-900">最大6倍</p>
              <p className="mt-1 text-sm text-slate-600">都道府県による就労支援実践率の差</p>
            </div>

            <div className="mt-6 text-sm leading-7 text-slate-700 space-y-3">
              <p>
                この差は、支援者個人の能力や熱意の差ではありません。分析が示す地域格差の説明因子：
              </p>
              <ul className="space-y-2 pl-4">
                {[
                  '機関密度と種類——就労移行・就業支援・HW専門援助の密度と組み合わせ',
                  '連携体制の成熟度——機関が存在することと機能する連携体制は別',
                  '組織文化の地域集積——「この地域の支援者はこうしている」という集積効果',
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Distribution range bar */}
            <div className="mt-6">
              <p className="text-xs font-semibold text-slate-500 mb-2">Q1転換率の分布（全47都道府県）</p>
              <div className="relative h-8 rounded-full bg-slate-100 overflow-hidden">
                {/* national average marker */}
                <div
                  className="absolute top-0 h-full w-0.5 bg-slate-400"
                  style={{ left: `${(0.208 / 0.35) * 100}%` }}
                />
                {PREF_DATA.map((p) => (
                  <div
                    key={p.name}
                    className={`absolute top-1 h-6 w-1.5 rounded-sm ${
                      p.tier === 3 ? 'bg-teal-500' :
                      p.tier === 2 ? 'bg-teal-300' :
                      p.tier === 1 ? 'bg-slate-300' : 'bg-slate-200'
                    }`}
                    style={{ left: `calc(${(p.rate / 0.35) * 100}% - 3px)` }}
                    title={`${p.name}: ${Math.round(p.rate * 100)}%`}
                  />
                ))}
              </div>
              <div className="mt-1 flex justify-between text-xs text-slate-400">
                <span>0%</span>
                <span>← 全国平均 20.8% →</span>
                <span>35%</span>
              </div>
            </div>

            {/* Region bar chart */}
            <div className="mt-6">
              <p className="text-xs font-semibold text-slate-500 mb-3">地域別 Q1転換率（就労支援者 n=3,053）</p>
              <div className="space-y-2">
                {[...REGION_DATA].sort((a, b) => b.q1Rate - a.q1Rate).map((r) => (
                  <div key={r.region} className="flex items-center gap-3">
                    <span className="w-24 shrink-0 text-xs text-slate-600 text-right">{r.region}</span>
                    <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-400 rounded-full"
                        style={{ width: `${(r.q1Rate / 0.35) * 100}%` }}
                      />
                    </div>
                    <span className="w-10 shrink-0 text-xs font-semibold text-slate-700">
                      {Math.round(r.q1Rate * 100)}%
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-400">Q1転換率 = 真の専門性実践者（全体の20.8%）の割合。ロジスティック回帰で分類。</p>
            </div>

            {/* Prefecture tier grid */}
            <div className="mt-6">
              <p className="text-xs font-semibold text-slate-500 mb-3">都道府県別 実践転換率ティア（4段階）</p>
              <div className="mb-3 flex flex-wrap gap-2">
                {TIER_CONFIG.map((t) => (
                  <span key={t.label} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${t.bg} ${t.text} ${t.border}`}>
                    {t.label} {t.threshold}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-1 sm:grid-cols-6">
                {[...PREF_DATA].sort((a, b) => b.rate - a.rate).map((p) => {
                  const cfg = TIER_CONFIG[3 - p.tier];
                  return (
                    <div
                      key={p.name}
                      className={`rounded-lg border px-2 py-1.5 text-center ${cfg.bg} ${cfg.text} ${cfg.border}`}
                      title={`Q1転換率 ${Math.round(p.rate * 100)}%`}
                    >
                      <p className="text-xs font-semibold leading-tight">{p.name}</p>
                      <p className="text-[10px] opacity-80">{Math.round(p.rate * 100)}%</p>
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-xs text-slate-400">
                ティア区分は四分位数（Q1=16.0% / Q2=17.9% / Q3=22.6%）。ランキングではなく分布の幅を示す設計。
                出典：toku18 n=3,053 支援者調査 / NBL分析（ロジスティック回帰）
              </p>
            </div>
          </article>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/knowledge/network" className="text-sm font-semibold text-teal-700 hover:underline">
              連携体制の設計を見る →
            </Link>
            <Link href="/knowledge/practice" className="text-sm text-slate-500 hover:text-slate-800 hover:underline">
              ← 実践知識に戻る
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
