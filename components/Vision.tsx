import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

export default function Vision() {
    return (
        <section
            id="vision"
            data-testid="vision"
            className="mx-auto max-w-7xl px-6 py-16 md:py-24 grid md:grid-cols-5 gap-12 items-start scroll-mt-24"
        >
            {/* LEFT */}
            <div className="md:col-span-2 space-y-8">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-sky-600">
                        Next Being ビジョン
                    </h2>
                    <p className="text-xl font-medium text-gray-900 mb-6">
                        AGI前夜に間に合う、<br />人間中心の社会実装。
                    </p>

                    <p className="text-gray-700 leading-relaxed text-lg">
                        猿 → 人間 → <span className="whitespace-nowrap font-medium text-indigo-700">人間＋AI</span> →{' '}
                        <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-indigo-600">Next Being</span>。
                        <br className="my-4 block" />
                        2027年、汎用AI(AGI)が社会の基本動作に溶ける
                        <strong className="font-semibold text-gray-900">転回点</strong>が来ると言われます。
                        NBLはこの前後を跨いで、
                        <span className="font-semibold underline decoration-sky-300 decoration-2 underline-offset-2">人×AI×コミュニティ×環境</span>
                        が協働する“次の在り方”を設計し、
                        <span className="font-semibold">設計・標準・物語</span>を実装します。
                    </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-sm text-gray-600 font-medium">
                        シンギュラリティは終着点ではなく、
                        <span className="text-indigo-600">人間拡張の始動点</span>。
                        尊厳が主軸に残るガードレールを、今つくる。
                    </p>
                </div>

                <div className="mt-4">
                    <Image
                        src="/images/evolution-nextbeing3.webp"
                        alt="猿→人間→人間＋AGI→Next Being"
                        width={1200}
                        height={600}
                        className="rounded-2xl"
                    />
                </div>
            </div>

            {/* RIGHT */}
            <div className="md:col-span-3 grid gap-6">
                <div className="grid md:grid-cols-3 gap-4">
                    {/* Phase 1 */}
                    <motion.article
                        whileHover={{ y: -5 }}
                        className="rounded-2xl border border-gray-200 p-5 shadow-sm bg-white hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <span className="inline-flex items-center rounded-full border border-sky-100 px-2 py-0.5 text-xs font-semibold bg-sky-50 text-sky-700">
                                Phase 1
                            </span>
                            <span className="text-xs text-gray-400">2025–2026</span>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">不公平の見える化</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            データ×現場の言語化で指標を整備し、合理的配慮を科学。
                            <span className="block mt-1 font-medium text-indigo-600">提案→申請→実装→KPI</span>
                            をJAC/Playbookで一筆書きにする。
                        </p>
                    </motion.article>

                    {/* Phase 2 */}
                    <motion.article
                        whileHover={{ y: -5 }}
                        className="rounded-2xl border border-gray-200 p-5 shadow-sm bg-white hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <span className="inline-flex items-center rounded-full border border-fuchsia-100 px-2 py-0.5 text-xs font-semibold bg-fuchsia-50 text-fuchsia-700">
                                Phase 2
                            </span>
                            <span className="text-xs text-gray-400">2026–2029</span>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">AGI前夜</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            人間＋AGIの共同行為を標準化。
                            意思決定は<span className="font-semibold text-gray-800">人が主</span>、AGIは可視化・最適化・安全装置を担う。
                        </p>
                        <div className="mt-3 text-[10px] uppercase font-bold text-gray-400 tracking-wider">Human-in-Command</div>
                    </motion.article>

                    {/* Phase 3 */}
                    <motion.article
                        whileHover={{ y: -5 }}
                        className="rounded-2xl border border-gray-200 p-5 shadow-sm bg-white hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <span className="inline-flex items-center rounded-full border border-emerald-100 px-2 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700">
                                Phase 3
                            </span>
                            <span className="text-xs text-gray-400">2030+</span>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">Commons化</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            支援・学習・労働が公共圏に開かれ、再利用可能に。
                            評価軸：<span className="font-medium">尊厳・貢献・持続可能性</span>。
                        </p>
                    </motion.article>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <article className="rounded-2xl border border-gray-100 p-6 shadow-sm bg-gray-50/50">
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">AGI時代の設計原則 <span className="text-xl text-indigo-500">❖</span></h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex gap-2"><span className="text-indigo-400">•</span> 尊厳を埋め込む (Dignity by Design)</li>
                            <li className="flex gap-2"><span className="text-indigo-400">•</span> 支援が自律を拡張する</li>
                            <li className="flex gap-2"><span className="text-indigo-400">•</span> 安全・説明責任・反証可能性</li>
                            <li className="flex gap-2"><span className="text-indigo-400">•</span> 人中心UIとアクセシビリティ</li>
                            <li className="flex gap-2"><span className="text-indigo-400">•</span> オープンナレッジ (CC BY)</li>
                        </ul>
                    </article>

                    <article className="rounded-2xl border border-gray-100 p-6 shadow-sm bg-white">
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">リサーチクエスチョン <span className="text-xl text-sky-500">?</span></h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex gap-2"><span className="text-sky-400">•</span> 症状×タスクの語彙はどこまで一般化可能？</li>
                            <li className="flex gap-2"><span className="text-sky-400">•</span> 配慮効果を測る最小チーム指標は？</li>
                            <li className="flex gap-2"><span className="text-sky-400">•</span> AGI協調は個人の創造性をどう拡張する？</li>
                            <li className="flex gap-2"><span className="text-sky-400">•</span> 公平性の可視化は意思決定を加速するか？</li>
                        </ul>
                    </article>
                </div>
            </div>
        </section >
    );
}
