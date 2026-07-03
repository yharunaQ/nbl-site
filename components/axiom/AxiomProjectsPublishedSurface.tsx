import NextLink from 'next/link';
import { ArrowRight, FileSearch, Handshake, Mail, Menu } from 'lucide-react';
import { projectCards } from '@/lib/content/rareDiseaseLinkageProject';

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
  { href: '/scene-entry', label: '8つの課題' },
  { href: '/case-readings', label: '相談事例' },
  { href: '/work-design-views-guide', label: '設計ガイド' },
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
    '/scene-entry',
    '/case-readings',
    '/work-design-views-guide',
    '/articles-social-questions',
    '/toolkit-studio',
  ].includes(item.href),
);

export default function AxiomProjectsPublishedSurface() {
  return (
    <div className="nbl-public-preview axiom-public-candidate min-h-screen w-full max-w-[100vw] overflow-x-hidden break-words bg-[#fbfaf5] text-slate-950 [overflow-wrap:anywhere] [&_*]:min-w-0">
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

      <main>
        <section className="border-b border-slate-200 bg-[#eef5f1]">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 lg:grid-cols-[1fr_0.82fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-800">
                Projects
              </p>
              <h1 className="mt-5 max-w-5xl break-words text-4xl font-semibold leading-tight tracking-normal text-slate-950 [overflow-wrap:anywhere] md:text-6xl">
                3つのプロジェクトを軸に、一緒に作る人を探しています。
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-9 text-slate-700">
                仕事と参加の条件デザイン、難病地域連携、福祉・医療・雇用の連携設計・人材育成。
                この3つを軸として、協働したり、パートナーとなったりできる方は、ぜひご連絡ください。
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  href="#project-inquiry"
                >
                  問い合わせ
                  <ArrowRight size={16} />
                </a>
                <NextLink
                  className="rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-teal-600 hover:text-teal-900"
                  href="/about-boundary"
                >
                  サイト情報
                </NextLink>
              </div>
            </div>
            <figure className="self-start overflow-hidden rounded-2xl border border-teal-100 bg-white shadow-sm">
              <img
                alt={projectsHeroImage.alt}
                className="aspect-[16/10] w-full object-cover"
                src={projectsHeroImage.src}
              />
            </figure>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-12">
          <div className="flex items-center gap-3">
            <Handshake size={22} className="text-teal-800" />
            <h2 className="text-3xl font-semibold tracking-normal text-slate-950">プロジェクト</h2>
          </div>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">
            この3つは、仲間が集まり、進められるところから順次始めていくための入口です。ご関心のある方、お仲間になっていただける方は、ぜひぜひご連絡いただければ幸いです。
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
              <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-4 text-sm leading-7 text-rose-950">
                個別の病状、診断名、個別相談、第三者の個人情報は、この入口では送らないでください。
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-xs leading-6 text-slate-500 md:flex-row md:items-center md:justify-between">
        <p className="font-semibold text-slate-600">Next Being Lab / 仕事条件で読む</p>
        <p>個別相談、医療・法律・人事判断、合理的配慮の最終判断は扱いません。</p>
      </footer>
    </div>
  );
}
