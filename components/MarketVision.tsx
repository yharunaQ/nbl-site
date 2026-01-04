import { motion } from 'framer-motion';
import { BarChart, FileJson, Layers } from 'lucide-react';
import React from 'react';

export default function MarketVision() {
    const bars = [
        {
            key: 'TAM',
            title: 'Total Addressable Market',
            width: 100,
            desc: '1〜2兆円級 (Global)',
            detail: 'AI×包摂が社会インフラ化。クラウド並みの基盤へ。',
            color: 'bg-indigo-500',
            bg: 'bg-indigo-100'
        },
        {
            key: 'SAM',
            title: 'Serviceable Available Market',
            width: 45,
            desc: '2-3,000億円 (JP/US)',
            detail: '知識労働・公共分野のB2B SaaS + アセスメント。',
            color: 'bg-fuchsia-500',
            bg: 'bg-fuchsia-100'
        },
        {
            key: 'SOM',
            title: 'Serviceable Obtainable Market',
            width: 12, // slightly adjusted for visual
            desc: '5-25億円 (Initial)',
            detail: 'PoC導入企業×50-150社。初期ターゲット。',
            color: 'bg-teal-500',
            bg: 'bg-teal-100'
        },
    ];

    return (
        <section id="market" className="mx-auto max-w-7xl px-6 py-16 md:py-24">
            <div className="max-w-3xl mx-auto text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                    AI × 包摂テック｜市場ビジョン
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                    NBLは「AI×包摂 (Inclusion Tech)」を、人とAIと環境が共進化する
                    <span className="font-bold text-indigo-700 mx-1">新しい社会インフラ</span>
                    として構築します。
                    合理的な配慮を“仕様化”し、経済性と倫理性を両立させます。
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Chart */}
                <div className="space-y-6">
                    {bars.map((bar, i) => (
                        <motion.div
                            key={bar.key}
                            initial={{ width: 0, opacity: 0 }}
                            whileInView={{ width: "100%", opacity: 1 }}
                            transition={{ delay: i * 0.2, duration: 0.8 }}
                            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-end mb-3">
                                <h4 className="font-bold text-gray-900">{bar.key} <span className="text-sm font-normal text-gray-500 block">{bar.title}</span></h4>
                                <span className="text-sm font-semibold text-gray-900">{bar.desc}</span>
                            </div>

                            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${bar.width}%` }}
                                    transition={{ delay: i * 0.2 + 0.5, duration: 1, type: "spring" }}
                                    className={`h-full rounded-full ${bar.color}`}
                                />
                            </div>
                            <p className="text-sm text-gray-600">{bar.detail}</p>
                        </motion.div>
                    ))}
                    <p className="text-xs text-gray-400 text-center mt-4">※ NBL試算モデルによる推計レンジ。</p>
                </div>

                {/* Layers */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl border p-8 space-y-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Layers className="text-indigo-600" />
                        Concept Layers
                    </h3>

                    <div className="space-y-4">
                        <div className="p-4 bg-white rounded-xl border border-indigo-100 shadow-sm relative pl-6">
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500 rounded-l-xl"></div>
                            <div className="text-xs font-bold text-indigo-500 uppercase mb-1">Layer 1</div>
                            <h4 className="font-bold text-gray-900">オペレーティング層</h4>
                            <p className="text-sm text-gray-600 mt-1">配慮の設計・合意・運用をOS化。業務フローに直接埋め込む。</p>
                        </div>

                        <div className="p-4 bg-white rounded-xl border border-fuchsia-100 shadow-sm relative pl-6">
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-fuchsia-500 rounded-l-xl"></div>
                            <div className="text-xs font-bold text-fuchsia-500 uppercase mb-1">Layer 2</div>
                            <h4 className="font-bold text-gray-900">支援AI層</h4>
                            <p className="text-sm text-gray-600 mt-1">UI変換・要約・負荷調整。個人特性に応じた適応型支援。</p>
                        </div>

                        <div className="p-4 bg-white rounded-xl border border-teal-100 shadow-sm relative pl-6">
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-teal-500 rounded-l-xl"></div>
                            <div className="text-xs font-bold text-teal-500 uppercase mb-1">Layer 3</div>
                            <h4 className="font-bold text-gray-900">監査・評価層</h4>
                            <p className="text-sm text-gray-600 mt-1">フェアネスログによる説明責任と、モデルの再利用性。</p>
                        </div>
                    </div>

                    <div className="pt-4 flex flex-wrap gap-3">
                        <a href="/docs/NBL_InclusionTech_Market_Brief.pdf" className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
                            <BarChart size={16} /> 市場ブリーフPDF
                        </a>
                        <a href="/docs/JAC_Pricing_Sheet.pdf" className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
                            <FileJson size={16} /> 価格表 (Draft)
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
