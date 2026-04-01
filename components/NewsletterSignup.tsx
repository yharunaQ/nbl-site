'use client';
import React, { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/newsletter-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
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

  if (submitted) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 px-6 py-5 text-center">
        <p className="text-base font-bold text-green-900">登録しました</p>
        <p className="mt-1 text-sm text-green-800">アップデートをお届けします。</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="メールアドレス"
        className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
      />
      <button
        type="submit"
        disabled={!email || submitting}
        className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
      >
        {submitting ? '送信中...' : '登録する'}
      </button>
      {error && <p className="text-sm text-rose-600 sm:col-span-2">{error}</p>}
    </form>
  );
}
