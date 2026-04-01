import { motion } from 'framer-motion';
import { ArrowRight, FileText, Zap } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function Hero() {
    return (
        <header className="relative overflow-hidden" data-testid="hero">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-indigo-50 to-fuchsia-50" />
            <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col gap-6 md:max-w-2xl"
                >
                    <span className="inline-flex w-fit items-center rounded-full border border-sky-200 px-3 py-1 text-xs md:text-sm bg-white/70 backdrop-blur text-sky-900 font-medium">
                        Next Being Lab — 人間の存在意義を拡張する社会インフラ
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold leading-tight text-gray-900">
                        働くは設計できる！
                        <br className="hidden md:block" />
                        <span className="text-gray-500 block text-2xl md:text-4xl mt-2 font-normal">At work, CAN matters.</span>
                    </h1>
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                        難病・慢性疾患・多様な特性を前提に、課題の見える化から配慮設計・運用・
                        成果の評価までを<span className="font-semibold text-indigo-600 bg-indigo-50 px-1 rounded">一本化</span>。現場と科学で進めます。
                    </p>
                    <div className="flex flex-wrap gap-3 mt-2">
                        <Link href="/contact" className="group inline-flex items-center gap-2 rounded-2xl px-5 py-3 bg-gray-900 text-white shadow-lg hover:bg-gray-800 transition-all hover:scale-105 active:scale-95">
                            ツール利用申込 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="/jac/guide" className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-all text-gray-700">
                            <FileText size={18} /> 仕事設計ガイド
                        </Link>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="rounded-3xl border border-white/50 bg-white/60 backdrop-blur-md shadow-xl p-6 md:p-8"
                >
                    <div className="grid gap-4 text-sm">
                        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                            <span className="text-gray-900 font-bold text-lg">配慮設計アシスト</span>
                            <span className="rounded-full bg-gray-100 text-gray-700 px-3 py-1 text-xs font-semibold border border-gray-200">
                                招待制
                            </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                '提案', '申請', '実装',
                                'KPI', 'テンプレ', '非同期会議',
                                '温度配慮', 'NCヘッドホン', '在宅・HB',
                                '通勤時差', 'タスク分担', '安全制限',
                            ]
                                .slice(0, 9)
                                .map((t, i) => (
                                    <div
                                        key={i}
                                        className="rounded-xl border border-gray-100 px-3 py-2 text-xs text-center text-gray-600 bg-white shadow-sm hover:shadow-md transition-shadow cursor-default"
                                    >
                                        {t}
                                    </div>
                                ))}
                        </div>
                        <div className="flex gap-3 pt-4">
                            <Link href="/contact" className="flex-1 text-center rounded-xl px-4 py-2 bg-gray-900 text-white text-sm font-medium hover:bg-black transition-colors">
                                利用申込
                            </Link>
                            <Link href="/jac/guide" className="flex-1 text-center rounded-xl px-4 py-2 border bg-white text-gray-600 text-sm hover:bg-gray-50 transition-colors">
                                ガイドを見る
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </header>
    );
}
