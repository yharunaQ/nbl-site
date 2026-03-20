import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

type SessionVerifyResponse =
  | {
      ok: true;
      paid: true;
      sessionId: string;
      amountTotal: number | null;
      currency: string | null;
      customerEmail: string | null;
      downloadUrl: string;
      expiresAt: string;
    }
  | { ok: false; paid: false; error: string };

export default function JacGuidebookSuccessPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [result, setResult] = useState<SessionVerifyResponse | null>(null);

  const sessionId = useMemo(() => {
    const raw = router.query.session_id;
    if (Array.isArray(raw)) return String(raw[0] || '').trim();
    return String(raw || '').trim();
  }, [router.query.session_id]);

  useEffect(() => {
    if (!router.isReady) return;
    if (!sessionId) {
      setLoading(false);
      setError('session_id が見つかりません。決済完了ページから再度アクセスしてください。');
      return;
    }

    let mounted = true;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`/api/ebook/session?session_id=${encodeURIComponent(sessionId)}`);
        const payload = (await response.json()) as SessionVerifyResponse;
        if (!response.ok || !payload.ok) {
          throw new Error(payload && 'error' in payload ? payload.error : '決済確認に失敗しました');
        }
        if (mounted) {
          setResult(payload);
        }
      } catch (e) {
        if (mounted) {
          setError(e instanceof Error ? e.message : '決済確認に失敗しました');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [router.isReady, sessionId]);

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900">
      <Head>
        <title>購入完了 | JACガイドブック</title>
      </Head>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <section className="rounded-3xl border border-emerald-200 bg-white p-6 md:p-8">
          <h1 className="text-2xl font-extrabold text-gray-900">購入ありがとうございます</h1>
          <p className="mt-2 text-sm text-gray-700">
            決済確認が完了すると、下にダウンロードボタンが表示されます。
          </p>

          {loading && (
            <p className="mt-5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
              決済情報を確認中です...
            </p>
          )}

          {error && (
            <p className="mt-5 rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-900">
              {error}
            </p>
          )}

          {result && result.ok && (
            <div className="mt-5 space-y-3">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
                決済確認済み: セッション {result.sessionId}
              </div>
              <a
                href={result.downloadUrl}
                className="inline-flex rounded-full bg-emerald-700 px-5 py-2 text-sm font-bold text-white hover:bg-emerald-800"
              >
                ガイドブックをダウンロード
              </a>
              <p className="text-xs text-gray-600">
                ダウンロードリンク有効期限: {new Date(result.expiresAt).toLocaleString('ja-JP')}
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/jac/guide"
              className="rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
            >
              JACガイドへ戻る
            </Link>
            <Link
              href="/jac/guidebook"
              className="rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
            >
              販売ページへ戻る
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
