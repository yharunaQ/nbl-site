import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import PageSeo from '@/components/PageSeo';

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
      <PageSeo
        title="旧配布リンクの確認 | 先行5章版アーカイブ"
        description="旧配布リンクからアクセスした購入者向けに、先行5章版アーカイブのダウンロード可否を確認する補助ページ。"
        path="/jac/guidebook/success"
      />

      <main className="mx-auto max-w-3xl px-6 py-12">
        <section className="rounded-3xl border border-emerald-200 bg-white p-6 md:p-8">
          <h1 className="text-2xl font-extrabold text-gray-900">旧配布リンクの確認</h1>
          <p className="mt-2 text-sm text-gray-700">
            現在の本体は 26カード版で、先行5章版は開発履歴として扱っています。ここは旧配布リンクから来た場合だけ、
            以前の配布データの可否を確認するための補助ページとして残しています。
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
                確認済み: セッション {result.sessionId}
              </div>
              <a
                href={result.downloadUrl}
                className="inline-flex rounded-full bg-emerald-700 px-5 py-2 text-sm font-bold text-white hover:bg-emerald-800"
              >
                旧版ワークブックをダウンロード
              </a>
              <p className="text-xs text-gray-600">
                ダウンロードリンク有効期限: {new Date(result.expiresAt).toLocaleString('ja-JP')}
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/jac/frames"
              className="rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
            >
              26カード版へ戻る
            </Link>
            <Link
              href="/jac/guidebook"
              className="rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
            >
              先行5章版アーカイブを見る
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
