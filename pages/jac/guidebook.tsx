import Head from 'next/head';
import Link from 'next/link';
import { useMemo, useState } from 'react';

type CheckoutApiResponse = {
  checkoutUrl?: string;
  sessionId?: string;
  error?: string;
};

export default function JacGuidebookPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canceled = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const url = new URL(window.location.href);
    return url.searchParams.get('canceled') === '1';
  }, []);

  const handleCheckout = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/ebook/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const payload = (await response.json()) as CheckoutApiResponse;
      if (!response.ok || !payload.checkoutUrl) {
        throw new Error(payload.error || '決済ページの準備に失敗しました。');
      }
      window.location.href = payload.checkoutUrl;
    } catch (e) {
      const message = e instanceof Error ? e.message : '購入処理に失敗しました。';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900">
      <Head>
        <title>JACガイドブック | 26フレーム実装版</title>
        <meta
          name="description"
          content="JACガイド26フレームを実装運用向けにまとめた電子ブック。"
        />
      </Head>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <section className="rounded-3xl border border-cyan-200 bg-white p-6 md:p-8">
          <p className="inline-flex rounded-full bg-cyan-100 px-3 py-1 text-[11px] font-bold text-cyan-900">
            JAC Guidebook
          </p>
          <h1 className="mt-3 text-2xl md:text-3xl font-extrabold text-gray-900">
            26フレーム実装ガイドブック（電子版）
          </h1>
          <p className="mt-3 text-sm md:text-base text-gray-700 leading-relaxed">
            JACガイドの26フレームを、実務で運用できる形へ再整理した電子ブックです。各章で「見分け方」「最初の一手」「根拠トレース」「匿名ナラティブ」「失敗リスク」を確認できます。
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
              <p className="text-xs text-gray-500">構成</p>
              <p className="text-sm font-semibold text-gray-900">26章（3レイヤー）</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
              <p className="text-xs text-gray-500">形式</p>
              <p className="text-sm font-semibold text-gray-900">PDF / EPUB（差し替え可）</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
              <p className="text-xs text-gray-500">決済</p>
              <p className="text-sm font-semibold text-gray-900">Stripe Checkout</p>
            </div>
          </div>

          <ul className="mt-5 space-y-2 text-sm text-gray-700">
            <li>・体調 / 職場運用 / 就職移行の3レイヤーで整理</li>
            <li>・類似フレームとの選び分け境界を章ごとに明記</li>
            <li>・data2匿名ナラティブと仮想の生の声（合成）で理解を補強</li>
            <li>・GLM / claims / data2 の根拠トレースを章ごとに可視化</li>
          </ul>

          <div className="mt-4 rounded-xl border border-cyan-100 bg-cyan-50 p-3">
            <p className="text-xs font-semibold text-cyan-900">26フレームと個別相談の役割分担</p>
            <p className="mt-1 text-xs text-cyan-800">
              26フレームは、個別事例を超えて反復する「困りごとの型」を短時間で把握するための土台です。最終調整はJAC個別相談で行います。
            </p>
            <p className="mt-1 text-xs text-cyan-800">
              個別相談で詰める例: 悪化トリガーの差、複数特性の重なり、開示範囲、復職段階、制度・契約との整合。
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCheckout}
              disabled={loading}
              className="rounded-full bg-cyan-700 px-5 py-2 text-sm font-bold text-white hover:bg-cyan-800 disabled:cursor-not-allowed disabled:bg-cyan-300"
            >
              {loading ? '決済ページを準備中...' : '購入してダウンロード'}
            </button>
            <Link
              href="/jac/guide"
              className="rounded-full border border-gray-300 bg-white px-5 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
            >
              JACガイドへ戻る
            </Link>
          </div>

          {canceled && (
            <p className="mt-4 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              決済はキャンセルされました。再度購入する場合は上のボタンを押してください。
            </p>
          )}
          {error && (
            <p className="mt-4 rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-900">
              {error}
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
