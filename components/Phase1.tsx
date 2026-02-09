import { ArrowRight, BookOpen, FileText, Layout, Users } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

export default function Phase1() {
    return (
        <section
            id="phase1"
            data-testid="phase1"
            className="mx-auto max-w-7xl px-6 py-16 md:py-24 grid md:grid-cols-5 gap-12 items-start scroll-mt-24"
        >
            <div className="md:col-span-2 space-y-6">
                <h2 className="text-3xl md:text-3xl font-bold text-gray-900">
                    Next Being Lab (Phase 1)<br />
                    <span className="text-xl md:text-2xl font-normal text-gray-600 block mt-2">合意可能な公平性の社会インフラ</span>
                </h2>

                <p className="text-gray-700 leading-relaxed">
                    NBLは、人×AI×コミュニティが共創する次の社会に向けた研究・実装ラボです。 Phase
                    1では、難病・慢性疾患・ニューロダイバージェンスを前提に、現場の“不公平”をデータで可視化し、
                    <span className="font-semibold px-1 bg-yellow-100 rounded">誰もが運用できる合意設計</span>へ翻訳します。
                </p>

                <p className="text-gray-700 leading-relaxed">
                    <span className="font-semibold text-gray-900">JAC (Job Accommodation Copilot)</span> と
                    <span className="font-semibold text-gray-900"> Accommodation Playbook</span> を核に、
                    <span className="font-medium bg-gray-100 px-1 rounded text-gray-800">提案→申請→実装→KPI</span> を一筆書きにし、
                    働き方・学び方・暮らし方の標準を現場からつくります。
                </p>

                <div className="mt-8 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                    <Image
                        src="/images/EEJ2.webp"
                        alt="Equality, Equity, Justice visual metaphor"
                        width={1200}
                        height={510}
                        className="w-full h-auto"
                    />
                </div>
            </div>

            <div className="md:col-span-3 space-y-6">
                <div className="rounded-3xl border border-gray-200 p-8 shadow-sm bg-white">
                    <h3 className="font-bold text-gray-900 mb-6 text-lg border-b pb-4">NBLの4つの柱 (Phase 1)</h3>

                    <div className="grid sm:grid-cols-2 gap-6">
                        {/* Product */}
                        <article className="group p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-md transition-all">
                            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">
                                <Layout size={14} /> Product
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2">JAC: 一筆書き運用</h4>
                            <p className="text-xs text-gray-600 mb-3 leading-relaxed">配慮の提案からKPI評価までを最小UIで提供。</p>
                            <a href="#product" className="text-sm font-medium text-gray-900 underline decoration-gray-300 hover:decoration-indigo-500 underline-offset-4 flex items-center gap-1">
                                JACを見る <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -ml-2 group-hover:ml-0" />
                            </a>
                        </article>

                        {/* Standard */}
                        <article className="group p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-md transition-all">
                            <div className="flex items-center gap-2 text-xs font-bold text-teal-600 uppercase tracking-wider mb-2">
                                <BookOpen size={14} /> Standard
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2">Playbook</h4>
                            <p className="text-xs text-gray-600 mb-3 leading-relaxed">現場で回る標準手順とテンプレート群。</p>
                            <a href="#phase1" className="text-sm font-medium text-gray-900 underline decoration-gray-300 hover:decoration-teal-500 underline-offset-4 flex items-center gap-1">
                                概要 <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -ml-2 group-hover:ml-0" />
                            </a>
                        </article>

                        {/* Research */}
                        <article className="group p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-md transition-all">
                            <div className="flex items-center gap-2 text-xs font-bold text-sky-600 uppercase tracking-wider mb-2">
                                <FileText size={14} /> Research
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2">ICF/EBPM Report</h4>
                            <p className="text-xs text-gray-600 mb-3 leading-relaxed">症状×タスク×KPIの語彙開発と検証。</p>
                            <a href="#reports" className="text-sm font-medium text-gray-900 underline decoration-gray-300 hover:decoration-sky-500 underline-offset-4 flex items-center gap-1">
                                レポート <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -ml-2 group-hover:ml-0" />
                            </a>
                        </article>

                        {/* Narrative */}
                        <article className="group p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-md transition-all">
                            <div className="flex items-center gap-2 text-xs font-bold text-fuchsia-600 uppercase tracking-wider mb-2">
                                <Users size={14} /> Narrative
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2">CAN BY DESIGN</h4>
                            <p className="text-xs text-gray-600 mb-3 leading-relaxed">配慮を仕様化し、合意を加速するキャンペーン。</p>
                            <a href="#campaign" className="text-sm font-medium text-gray-900 underline decoration-gray-300 hover:decoration-fuchsia-500 underline-offset-4 flex items-center gap-1">
                                キャンペーン <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -ml-2 group-hover:ml-0" />
                            </a>
                        </article>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <article className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm flex flex-col justify-between">
                        <div>
                            <h3 className="font-bold text-gray-900 mb-3 text-lg">Foundation</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-start gap-2"><span className="text-gray-400 mt-1">•</span> 難病・慢性疾患×就労の国際比較</li>
                                <li className="flex items-start gap-2"><span className="text-gray-400 mt-1">•</span> 合理的配慮の科学化と指標設計</li>
                                <li className="flex items-start gap-2"><span className="text-gray-400 mt-1">•</span> 物語化による合意形成の実装</li>
                            </ul>
                        </div>
                    </article>

                    <article className="rounded-2xl border border-gray-200 p-6 bg-gray-900 text-white shadow-sm flex flex-col justify-between">
                        <div>
                            <h3 className="font-bold mb-3 text-lg text-white">Founder’s Note</h3>
                            <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                                春名由一郎 (Founder/Scientist) が、現場の声×研究の気づきを記録。合意可能な設計と実装の途中経過をブログで発信中。
                            </p>
                        </div>
                        <a
                            href="/blog"
                            className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
                        >
                            Blogを読む <ArrowRight size={16} />
                        </a>
                    </article>
                </div>
            </div>
        </section>
    );
}
