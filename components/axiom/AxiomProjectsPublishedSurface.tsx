import NextLink from 'next/link';
import { ArrowRight, FileSearch, Handshake, Mail, Menu } from 'lucide-react';
import { projectCards } from '@/lib/content/rareDiseaseLinkageProject';
import { AxiomNextSiteLink } from './AxiomNextSiteLinks';
import { AxiomNextSiteHeader, AxiomNextSiteFooter } from './AxiomNextSiteChrome';

const collaborationModes = [
  '研究会・勉強会で一緒に考える',
  '資料やページのレビューに参加する',
  '地域・組織で小さく試す',
  '研修・人材育成の形を一緒に作る',
  '制度設計・政策翻訳の論点を整理する',
  '運営・資金・広報を支える',
];

const contactEmail = 'info@nextbeinglab.org';
const contactSubject = 'NBLプロジェクトの問い合わせ';
const contactMailto = `mailto:${contactEmail}?subject=${encodeURIComponent(contactSubject)}`;

const projectsHeroImage = {
  src: '/images/nbl-projects-tom-sawyer-wall-painting-hero-v1.png',
  alt: '白い壁を楽しそうに塗る少年と、参加したくなる人々のイラスト',
};

const navItems = [
  { href: '/', label: 'トップ' },
  { href: '/virtual-news', label: 'バーチャルニュース' },
  { href: '/work-design-views-guide', label: '設計ガイド' },
  { href: '/case-readings', label: '相談事例' },
  { href: '/articles-social-questions', label: 'NBLレポート' },
  { href: '/toolkit-studio', label: 'ツールキット' },
  { href: '/work-condition-window', label: '障害種類から見る' },
  { href: '/theory-method-trust', label: 'NBLの専門性' },
  { href: '/projects', label: 'プロジェクト' },
  { href: '/about-boundary', label: 'サイト情報' },
] as const;

const primaryNavItems = navItems.filter((item) =>
  [
    '/',
    '/virtual-news',
    '/work-design-views-guide',
    '/case-readings',
    '/articles-social-questions',
    '/toolkit-studio',
  ].includes(item.href),
);

export default function AxiomProjectsPublishedSurface({ candidateBusinessContext = false }: { candidateBusinessContext?: boolean } = {}) {
  return (
    <div className={`nbl-public-preview axiom-public-candidate min-h-screen w-full max-w-[100vw] ${candidateBusinessContext ? '' : 'overflow-x-hidden'} break-words bg-[#fbfaf5] text-slate-950 [overflow-wrap:anywhere] [&_*]:min-w-0`}>
      {candidateBusinessContext ? <AxiomNextSiteHeader currentPath="/projects" /> : (
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-[#fbfaf5]/94 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
          <NextLink href="/" className="flex shrink-0 flex-col leading-tight">
            <span className="text-[11px] font-semibold tracking-[0.12em] text-teal-800">
              Next Being Lab
            </span>
            <span className="text-sm font-semibold text-slate-950">仕事条件で読む</span>
          </NextLink>
          <nav
            aria-label="NBL site navigation"
            className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex"
          >
            {primaryNavItems.map((item) => (
              <NextLink
                aria-current={item.href === '/projects' ? 'page' : undefined}
                className={`whitespace-nowrap border-b-2 px-2.5 py-1.5 text-[13px] transition xl:px-3 xl:text-sm ${
                  item.href === '/projects'
                    ? 'border-teal-800 text-slate-950'
                    : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-950'
                }`}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </NextLink>
            ))}
          </nav>
          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <form
              action="/search"
              className="flex w-[min(23vw,270px)] min-w-[190px] items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm"
            >
              <FileSearch className="shrink-0 text-teal-800" size={15} />
              <input
                aria-label="サイト内検索"
                className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
                name="q"
                placeholder="サイト内検索"
                type="search"
              />
              <button
                className="shrink-0 rounded-full bg-teal-800 px-3 py-1 text-xs font-semibold text-white"
                type="submit"
              >
                検索
              </button>
            </form>
            <details className="group relative">
              <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-teal-500 hover:text-teal-950 [&::-webkit-details-marker]:hidden">
                <Menu size={15} />
                全ページ
              </summary>
              <div className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                <nav aria-label="NBL site all pages" className="grid p-2">
                  {navItems.map((item) => (
                    <NextLink
                      aria-current={item.href === '/projects' ? 'page' : undefined}
                      className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                        item.href === '/projects'
                          ? 'bg-teal-50 text-teal-950'
                          : 'text-slate-700 hover:bg-[#fbfaf5] hover:text-teal-950'
                      }`}
                      href={item.href}
                      key={item.href}
                    >
                      {item.label}
                    </NextLink>
                  ))}
                </nav>
              </div>
            </details>
          </div>
        </div>
        <nav
          aria-label="NBL site mobile navigation"
          className="flex max-w-full gap-2 overflow-x-auto border-t border-slate-200 px-5 py-2 lg:hidden [scrollbar-width:none]"
        >
          <NextLink
            className="shrink-0 whitespace-nowrap border-b-2 border-transparent px-2 py-1.5 text-[13px] font-semibold text-teal-800"
            href="/search"
          >
            検索
          </NextLink>
          {primaryNavItems.map((item) => (
            <NextLink
              className="shrink-0 whitespace-nowrap border-b-2 border-transparent px-2 py-1.5 text-[13px] text-slate-600"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </NextLink>
          ))}
        </nav>
      </header>
      )}

      <main>
        <section className="border-b border-slate-200 bg-[#eef5f1]">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 lg:grid-cols-[1fr_0.82fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-800">
                {candidateBusinessContext ? 'Work with NBL' : 'Projects'}
              </p>
              <h1 className={`mt-5 max-w-5xl break-words ${candidateBusinessContext ? 'text-[clamp(1.6rem,8vw,3.75rem)]' : 'text-4xl'} font-semibold leading-tight tracking-normal text-slate-950 [overflow-wrap:anywhere] md:text-6xl`}>
                {candidateBusinessContext ? <><span className="block">次の授業は、</span><span className="block">あなたの現場を題材に。</span></> : '3つのプロジェクトを軸に、一緒に作る人を探しています。'}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-9 text-slate-700">
                {candidateBusinessContext
                  ? '研修を組む方へ。働く人、仲間、仕事を頼む人が同じ場面を読む「仕事の分かれ道」を、ご自身の現場に合わせて作れます。次回は先方の講師だけで進められるところまでを、協働の範囲として相談します。'
                  : '仕事と参加の条件デザイン、難病地域連携、福祉・医療・雇用の連携設計・人材育成。この3つを軸として、協働したり、パートナーとなったりできる方は、ぜひご連絡ください。'}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  href="#project-inquiry"
                >
                  {candidateBusinessContext ? '協働テーマと進め方を見る' : '問い合わせ'}
                  <ArrowRight size={16} />
                </a>
                <NextLink
                  className="rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-teal-600 hover:text-teal-900"
                  href="/about-boundary"
                >
                  {candidateBusinessContext ? '運営者と研究活動を知る' : 'サイト情報'}
                </NextLink>
              </div>
            </div>
            <figure className="self-start overflow-hidden rounded-2xl border border-teal-100 bg-white shadow-sm">
              <img
                alt={candidateBusinessContext ? '職場の仕事と分担を可視化して見直す場面のイメージ' : projectsHeroImage.alt}
                className="aspect-[16/10] w-full object-cover"
                src={candidateBusinessContext ? '/images/nbl-virtual-news/team-fairness-work-allocation-redesign-hero-v1.png' : projectsHeroImage.src}
              />
              {candidateBusinessContext && <figcaption className="px-4 py-3 text-xs leading-6 text-slate-600">仕事と分担を見直す場面を描いた制作画像です。</figcaption>}
            </figure>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-12">
          <div className="flex items-center gap-3">
            <Handshake size={22} className="text-teal-800" />
            <h2 className="text-3xl font-semibold tracking-normal text-slate-950">{candidateBusinessContext ? '協働を育てる三つのプロジェクト' : 'プロジェクト'}</h2>
          </div>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">
            {candidateBusinessContext
              ? '仕事と社会参加、難病の地域連携、分野をまたぐ人材育成。関心を寄せる人・組織と、課題や実施条件を確かめながら具体化する構想です。研究会への参加から、組織の課題に沿った協働まで、取り組み方を相談できます。'
              : 'この3つは、仲間が集まり、進められるところから順次始めていくための入口です。ご関心のある方、お仲間になっていただける方は、ぜひぜひご連絡いただければ幸いです。'}
          </p>
          <div className="mt-7 grid gap-5 lg:grid-cols-3">
            {projectCards.map((project) => (
              <article
                className="flex min-h-[18rem] flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                key={project.title}
              >
                {project.tag ? (
                  <p className="text-xs font-semibold tracking-[0.16em] text-teal-800">
                    {project.tag}
                  </p>
                ) : null}
                <h3 className="mt-3 text-2xl font-semibold leading-snug tracking-normal text-slate-950">
                  {project.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-700">{project.description}</p>
              </article>
            ))}
          </div>
          <div className="mt-8">
            <p className="text-sm font-semibold text-slate-950">
              たとえば、こんな関わり方からで十分です。
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {collaborationModes.map((item) => (
                <span
                  className="rounded-full border border-teal-100 bg-[#eef5f1] px-3 py-2 text-sm font-semibold leading-6 text-teal-950"
                  key={item}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="project-inquiry" className="scroll-mt-24 border-y border-slate-200 bg-white">
          {candidateBusinessContext && (
            <div className="mx-auto max-w-7xl px-5 pt-12" data-candidate-business-context>
              <h2 className="text-2xl font-semibold">自分たちで上演する、現場の一幕を一緒につくる</h2>
              <p className="mt-4 leading-8">まず創刊号の台本を開いてみてください。読み合わせと振り返りまで、ご自身の会議で進められます。教える人がいない、発注を受ける人が決定に加われないなど、題材そのものを組み替えたいときに協働が始まります。</p>
              <p className="mt-3 leading-8"><AxiomNextSiteLink href="/preview/axiom-next-nbl-v2/edition-inspection#meeting">創刊号の無料の進行台本を開く</AxiomNextSiteLink></p>
              <h3 className="mt-6 text-lg font-semibold">研修・支援機関との有償の共同制作案</h3>
              <p className="mt-2 leading-8">先方の講師と扱う場面を一つ選び、本人と買い手や管理者が別々に判断できる台本を編集します。一度一緒に進行し、書き換えられる台本と講師用の解説を渡します。次の授業で講師が自分で進められたか、現場がどの案を試せたかを振り返ります。</p>
              <p className="mt-2 leading-8">授業日、試せる現場、編集回数と担当を決め、当事者の編集参加への謝金、読みやすい形式での制作、講師の準備と引継ぎにかかる費用を見積もります。</p>
              <section id="regional-material-production" className="mt-8 scroll-mt-32 border-t border-slate-200 pt-6" aria-labelledby="regional-material-production-title">
                <h3 id="regional-material-production-title" className="text-lg font-semibold">地域の進路会議・研修に使う解説と配布資料</h3>
                <p className="mt-2 leading-8">たとえば一つの地域で、応募前に学校・職場・介助事業者の誰に何を確認できるかを取材します。納品の候補は、関係者の確認を受けた短い解説と字幕、翌年度の担当者も書き換えられる会議資料です。</p>
                <p className="mt-2 leading-8">取材協力への謝金、編集と字幕、修正回数、納期、組織内で再利用できる範囲を話し合い、費用を見積もります。地域外にも公開する素材は、協力者の了解を得て、資金の出所と訂正の窓口を示します。</p>
                <p className="mt-2 leading-8"><AxiomNextSiteLink className="font-semibold text-teal-900 underline underline-offset-4" href="/preview/axiom-next-nbl-v2/first-day-assistance#meeting">特集の会議用メモを読む</AxiomNextSiteLink></p>
              </section>
              <h3 className="mt-6 text-lg font-semibold">授業の外で、勤務や予算を決める方へ</h3>
              <p className="mt-2 leading-8">現場責任者に決裁と予算があるなら、<AxiomNextSiteLink href="/preview/axiom-next-nbl-v2/work-design-views-guide">一工程の仕事と交代勤務</AxiomNextSiteLink>の共同設計を検討できます。地域を越えた支援供給なら、<AxiomNextSiteLink href="/materials/policy">総合政策案</AxiomNextSiteLink>から委託や財源の選択を検討します。編集協働では資金の出所を示し、異論と訂正を掲載できる条件を確かめます。</p>
              <p className="mt-4 leading-8"><AxiomNextSiteLink href="/preview/axiom-next-nbl-v2/about-boundary#operator-profile">運営責任者・春名由一郎のプロフィール</AxiomNextSiteLink>と、<AxiomNextSiteLink href="/materials/research/NBL-RK-0002">資料から判断を組み立てた研究抄録の一例</AxiomNextSiteLink>もご覧いただけます。</p>
            </div>
          )}
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="flex items-center gap-3">
                <Mail size={22} className="text-teal-800" />
                <h2 className="text-3xl font-semibold tracking-normal text-slate-950">
                  問い合わせ
                </h2>
              </div>
              <p className="mt-4 text-base leading-8 text-slate-700">
                お問い合わせはメールでお願いします。
              </p>
              <a
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                href={contactMailto}
              >
                {contactEmail}
                <ArrowRight size={16} />
              </a>
              <p className="mt-4 text-sm leading-7 text-slate-600">件名例: {contactSubject}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-[#fbfaf5] p-6">
              <p className="text-sm leading-7 text-slate-700">
                関心のあるプロジェクト名やテーマを、短く添えてください。
              </p>
              {candidateBusinessContext && <p className="mt-4 text-sm leading-7 text-slate-700">組織や活動の背景と、次に話し合いたいことを添えてください。個人の健康情報は必要ありません。</p>}
              <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-4 text-sm leading-7 text-rose-950">
                個別の病状、診断名、個別相談、第三者の個人情報は、この入口では送らないでください。
              </p>
            </div>
          </div>
        </section>
      </main>
      {candidateBusinessContext ? <AxiomNextSiteFooter /> : (
      <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-xs leading-6 text-slate-500 md:flex-row md:items-center md:justify-between">
        <p className="font-semibold text-slate-600">Next Being Lab / 仕事条件で読む</p>
        <p>個別相談、医療・法律・人事判断、合理的配慮の最終判断は扱いません。</p>
      </footer>
      )}
    </div>
  );
}
