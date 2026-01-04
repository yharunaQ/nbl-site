import { ArrowRight, CheckCircle2, FlaskConical, HelpCircle, School } from 'lucide-react';
import React from 'react';

export default function Services() {
    return (
        <div className="space-y-16">
            {/* PoC Description */}
            <section id="poc" data-testid="poc" className="mx-auto max-w-7xl px-6 pt-16">
                <div className="max-w-3xl mx-auto text-center mb-10">
                    <span className="inline-block py-1 px-3 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-100">
                        Proof of Concept
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">実証パイロット (PoC) とは？</h2>
                    <p className="text-gray-700 text-lg">
                        小さく早く検証して、<span className="font-bold text-emerald-700">“できる”を証明</span>
                        する短期プロジェクトです。
                        <br className="hidden md:block" />
                        <span className="font-bold">2〜4週間</span>で、提案からKPIまでを一筆書きに検証します。
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section id="services" data-testid="services" className="mx-auto max-w-7xl px-6">
                <div className="grid md:grid-cols-3 gap-6">
                    <article className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
                            <FlaskConical size={24} />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">30日クイックアセスメント</h3>
                        <p className="text-sm text-gray-600 mb-4 h-10">現行業務の配慮実装余地と、改善インパクトを可視化。</p>
                        <a href="#contact" className="text-sm font-medium text-indigo-600 flex items-center gap-1 hover:gap-2 transition-all">
                            相談する <ArrowRight size={14} />
                        </a>
                    </article>

                    <article className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                            <School size={24} />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">研修・講義・認定</h3>
                        <p className="text-sm text-gray-600 mb-4 h-10">「職場配慮デザイン認定(仮)」など、標準手順と評価設計を習得。</p>
                        <a href="#reports" className="text-sm font-medium text-indigo-600 flex items-center gap-1 hover:gap-2 transition-all">
                            教材を見る <ArrowRight size={14} />
                        </a>
                    </article>

                    <article className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                            <CheckCircle2 size={24} />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">JAC α/β 導入サポート</h3>
                        <p className="text-sm text-gray-600 mb-4 h-10">2〜4週間のPoCから開始。ツール導入と定着支援。</p>
                        <a href="#contact" className="text-sm font-medium text-indigo-600 flex items-center gap-1 hover:gap-2 transition-all">
                            問い合わせ <ArrowRight size={14} />
                        </a>
                    </article>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="mx-auto max-w-7xl px-6 bg-gray-50/50 py-12 rounded-3xl">
                <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">料金モデル (目安)</h2>
                    <p className="text-sm text-gray-500">実施規模・対象人数により変動します。</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {/* Small */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Starter</div>
                        <div className="text-lg font-bold text-gray-900 mb-2">PoC (小規模検証)</div>
                        <div className="text-3xl font-bold text-indigo-600 mb-4">2-4<span className="text-base font-normal text-gray-500">週間</span></div>
                        <p className="text-sm text-gray-600 mb-4 border-t pt-4">
                            少人数・1部門で仮説検証。<br />まず動かして見るプラン。
                        </p>
                        <div className="text-xs text-gray-400 italic">価格：お問い合わせ</div>
                    </div>

                    {/* Medium */}
                    <div className="bg-white rounded-2xl border-2 border-indigo-100 p-6 shadow-md relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded-bl-lg">POPULAR</div>
                        <div className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">Standard</div>
                        <div className="text-lg font-bold text-gray-900 mb-2">Pilot (実装テスト)</div>
                        <div className="text-3xl font-bold text-indigo-600 mb-4">~3<span className="text-base font-normal text-gray-500">ヶ月</span></div>
                        <p className="text-sm text-gray-600 mb-4 border-t pt-4">
                            複数部署での標準手順・評価設計の検証。<br />本格導入の前段階。
                        </p>
                        <div className="text-xs text-gray-400 italic">価格：要相談</div>
                    </div>

                    {/* Enterprise */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Enterprise</div>
                        <div className="text-lg font-bold text-gray-900 mb-2">研修・認定</div>
                        <div className="text-3xl font-bold text-gray-700 mb-4">Spot<span className="text-base font-normal text-gray-500"> / Annual</span></div>
                        <p className="text-sm text-gray-600 mb-4 border-t pt-4">
                            現場導入の標準手順講義や、<br />職場配慮デザイン認定など。
                        </p>
                        <div className="text-xs text-gray-400 italic">価格：要相談</div>
                    </div>
                </div>

                <div className="text-center mt-10">
                    <a
                        href="mailto:info@nextbeinglab.org?subject=NBL%20PoC%E7%9B%B8%E8%AB%87"
                        className="inline-flex items-center gap-2 rounded-xl px-6 py-3 bg-gray-900 text-white font-bold shadow-lg hover:shadow-xl hover:bg-black transition-all"
                    >
                        見積もり・相談する (Email)
                    </a>
                </div>
            </section>

            {/* FAQ */}
            <section className="mx-auto max-w-3xl px-6">
                <details className="group rounded-2xl border border-gray-200 bg-white shadow-sm open:shadow-md transition-all">
                    <summary className="flex items-center justify-between cursor-pointer p-5 font-bold text-gray-900">
                        <span className="flex items-center gap-2"><HelpCircle size={18} className="text-gray-400" /> よくある質問</span>
                        <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="px-5 pb-5 pt-0 text-sm text-gray-700 space-y-2 border-t border-gray-100 mt-2 pt-4">
                        <p><span className="font-bold">対象：</span> 企業・自治体・NPO。部署単位の小規模からOK。</p>
                        <p><span className="font-bold">データ：</span> 個人情報は扱わず、タスク条件×症状像で設計します。</p>
                        <p><span className="font-bold">NDA：</span> 必要に応じて締結可能。ログと監査可能性を重視。</p>
                        <p><span className="font-bold">期間：</span> 2〜4週間 (意思決定の速さを優先)。</p>
                    </div>
                </details>
            </section>
        </div>
    );
}
