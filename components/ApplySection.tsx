'use client';
import React, { useState } from 'react';

const ROLES = [
  '就労移行・就労継続支援事業所の支援員',
  'ジョブコーチ（職場適応援助者）',
  '障害者職業生活相談員',
  '企業の障害者雇用担当者・人事',
  'その他',
];

export default function ApplySection() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [memo, setMemo] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !role) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/jac-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, role, memo }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError((json as { error?: string }).error || '送信に失敗しました。');
        return;
      }
      setSubmitted(true);
    } catch {
      setError('ネットワークエラーが発生しました。');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="apply" className="mx-auto w-full max-w-7xl px-6 py-16 scroll-mt-24">
      <div className="max-w-xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
          就労支援者向けAI補助ツール
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          就労支援見立てサポート 利用申込
        </h2>
        <p className="text-sm text-gray-600 mb-5 leading-relaxed">
          就労支援員・ジョブコーチ・障害者職業生活相談員などを対象に、招待制で提供しています。
          申込後、個人単位のアクセストークンをご登録のメールアドレスへ即時送付します。
        </p>
        <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4 mb-8 grid gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">料金</span>
            <span className="font-semibold text-gray-900">無償（フィードバック提供が条件）</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">利用上限</span>
            <span className="font-semibold text-gray-900">アセスメント実行 1日20件</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">用途</span>
            <span className="font-semibold text-gray-900">就労支援業務での相談整理に限る</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            ※ 就労支援目的以外での使用、第三者へのアクセス情報の共有は禁止です。
          </p>
        </div>

        {submitted ? (
          <div className="rounded-2xl bg-green-50 border border-green-200 p-6 text-center">
            <p className="text-lg font-bold text-green-900 mb-2">申込を受け付けました</p>
            <p className="text-sm text-green-800">
              アクセストークンをご登録のメールアドレスへ送付しました。メールをご確認ください。
              届かない場合は迷惑メールフォルダをご確認ください。
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                メールアドレス <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                お名前（任意）
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="山田 太郎"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                職種 <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                <option value="">選択してください</option>
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                どんな場面で使いたいか（任意）
              </label>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                rows={3}
                placeholder="例：就労移行で担当しているケースの配慮整理に使いたい"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
              />
            </div>

            {error && (
              <p className="text-sm text-rose-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={!email || !role || submitting}
              className="w-full rounded-xl bg-gray-900 px-6 py-3.5 text-sm font-bold text-white hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? '送信中...' : '申し込む'}
            </button>

            <p className="text-xs text-gray-400 text-center leading-relaxed">
              個人情報はアクセス管理のみに使用します。第三者への提供はしません。
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
