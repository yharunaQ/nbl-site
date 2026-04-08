import Image from 'next/image';
import Link from 'next/link';
import PageSeo from '@/components/PageSeo';
import SiteNav from '@/components/SiteNav';

export default function AboutPage() {
  return (
    <>
      <PageSeo
        title="NBLについて | Next Being Lab"
        description="NBLは、インクルーシブ就労支援の実践知識を開発・提供する知識プラットフォームです。就労支援を起点に、AI時代に多様な人が参加できる仕事設計へと取り組みを広げています。"
        path="/about"
      />

      <SiteNav />

      <main className="min-h-screen bg-[linear-gradient(180deg,#fffef8_0%,#f8fafc_55%,#eef2ff_100%)] text-slate-900">
        <div className="mx-auto max-w-3xl px-6 py-14 md:py-20">

          {/* Header */}
          <header>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Next Being Lab
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              NBLについて
            </h1>
            <p className="mt-5 text-base leading-8 text-slate-700">
              NBLは、インクルーシブ就労支援の実践知識を開発・提供する知識プラットフォームです。
              就労支援を起点に、AI時代に多様な人が能力・意欲を発揮して参加できる仕事設計へと、取り組みを広げています。
            </p>
          </header>

          {/* Section 1: Problem */}
          <section className="mt-14">
            <h2 className="text-lg font-semibold text-slate-900">私たちが取り組む問題</h2>
            <div className="mt-4 space-y-4 text-base leading-8 text-slate-700">
              <p>
                日本では、就労に困難を抱える人の多くが、その困難を「個人の問題」として扱われ続けています。障害や難病がある、体調が不安定、コミュニケーションのスタイルが違う——それは個人の能力の問題ではなく、仕事・環境・支援・制度の設計課題です。
              </p>
              <p>
                同時に、支援に関わる実践者の71.9%が「意欲はあるが実施できていない」という現実があります。支援の質は、個人の頑張りではなく、実践知識のアクセスと組織設計で変わります。
              </p>
            </div>
          </section>

          {/* Section 2: Core */}
          <section className="mt-12">
            <h2 className="text-lg font-semibold text-slate-900">コアにあるもの：専門知識ネットワーク</h2>
            <div className="mt-4 space-y-4 text-base leading-8 text-slate-700">
              <p>
                NBLの中心には、日本の当事者・支援者のデータから導いた専門知識ネットワークがあります。9,000件超の実データを分析し、就労の詰まりがどのような因果構造で起きるか、どの介入が効くかを体系化しました。
              </p>
              <p>
                この知識ネットワークは更新し続けます。現場の相談事例から学び、新しいエビデンスを吸収し、より正確な実践知識へと育てていく仕組みを最初から組み込んでいます。
              </p>
            </div>
            <div className="mt-6">
              <Link
                href="/about/knowledge-base"
                className="text-sm font-semibold text-teal-700 hover:text-teal-900 hover:underline"
              >
                知識ネットワークについて詳しく →
              </Link>
            </div>
          </section>

          {/* Section 3: Philosophy */}
          <section className="mt-12 rounded-2xl border border-teal-200 bg-teal-50 px-6 py-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
              設計の哲学
            </p>
            <p className="mt-3 text-xl font-semibold text-slate-950">
              就労の詰まりは、設計で解ける。
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              この考えは、日本の実データから独立して導いたものです。海外で確立されたIPS/SE（個別就労支援）の原則と、日本のデータは独立に整合しています。輸入理論の適用ではなく、日本の実態から積み上げた知識です。
            </p>
          </section>

          {/* Section: Vision */}
          <section className="mt-14">
            <h2 className="text-lg font-semibold text-slate-900">NBLの事業の地平</h2>
            <p className="mt-4 text-base leading-8 text-slate-700">
              NBLは、インクルーシブ就労支援の実践知識を開発・提供する知識プラットフォームです。
              就労支援を起点に、AI時代に多様な人が能力・意欲を発揮して参加できる仕事設計へと、取り組みを広げています。
            </p>
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <Image
                src="/about/nbl-work-design-vision.jpg"
                alt="NBLの仕事設計：支援で困りごとを減らし、設計で参加を広げる。現在のNBLから今後のNBLへの事業の地平を示す図。"
                width={1200}
                height={900}
                className="w-full"
              />
            </div>
            <p className="mt-4 text-xs leading-6 text-slate-500">
              AIで人を不要にするのではなく、AIで余力をつくり、人が参加できる仕事を増やす。
            </p>
          </section>

          {/* Subpages */}
          <section className="mt-14">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              詳細情報
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                {
                  href: '/about/knowledge-base',
                  title: '知識ネットワークについて',
                  desc: 'FCHMAアトラス・3ループ更新サイクル・専門知識の構造。',
                },
                {
                  href: '/about/data',
                  title: 'データ基盤・調査概要',
                  desc: '調査規模・分析方法・IPS/SEとの独立整合・倫理について。',
                },
              ].map(({ href, title, desc }) => (
                <Link
                  key={href}
                  href={href}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-teal-300 hover:shadow-sm"
                >
                  <p className="font-semibold text-slate-900 group-hover:text-teal-700">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{desc}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Contact */}
          <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-5">
            <p className="text-sm font-semibold text-slate-700">お問い合わせ</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              NBLの活動・データ・サービスについてのご質問は{' '}
              <Link href="/contact" className="font-semibold text-teal-700 hover:underline">
                お問い合わせフォーム
              </Link>
              からどうぞ。
            </p>
          </div>

          {/* Back */}
          <div className="mt-6">
            <Link href="/" className="text-sm text-slate-500 hover:text-slate-800 hover:underline">
              ← ホームに戻る
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
