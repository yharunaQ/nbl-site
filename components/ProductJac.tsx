import { Check, Download, FileText, Settings, Shield } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

export default function ProductJac() {
    return (
        <section id="product" data-testid="product" className="mx-auto max-w-7xl px-6 py-16 md:py-24 bg-gray-50/50 -mx-6 md:-mx-8 lg:-mx-12 xl:mx-auto rounded-3xl my-8">
            <div className="grid md:grid-cols-2 gap-12 items-start">
                {/* LEFT */}
                <div className="space-y-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
                            Job Accommodation Copilot
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">
                            JAC
                        </h2>
                        <h3 className="text-xl md:text-2xl font-medium text-gray-500 mb-6">
                            診断名不要、タスク条件で設計。
                        </h3>
                    </div>

                    <p className="text-gray-700 leading-relaxed text-lg">
                        「症状×タスク」から配慮を設計し、合意形成、実装、KPI評価までを一筆書きでサポート。
                        調整後の実力（Design-Adjusted Merit）で正当に評価される環境を作ります。
                    </p>

                    <div className="grid gap-4">
                        <div className="flex gap-4 items-start p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><Settings size={20} /></div>
                            <div>
                                <h4 className="font-bold text-gray-900">Catalog & Recommend</h4>
                                <p className="text-sm text-gray-600 mt-1">症状×タスクから最適な配慮案をカタログから提案。</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                            <div className="p-2 bg-teal-50 rounded-lg text-teal-600"><FileText size={20} /></div>
                            <div>
                                <h4 className="font-bold text-gray-900">Document Generator</h4>
                                <p className="text-sm text-gray-600 mt-1">本人・上長・人事の合意文書を自動整形しPDF出力。</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                            <div className="p-2 bg-sky-50 rounded-lg text-sky-600"><Shield size={20} /></div>
                            <div>
                                <h4 className="font-bold text-gray-900">Privacy & KPI</h4>
                                <p className="text-sm text-gray-600 mt-1">病名を扱わず抽象化。欠勤・疲労・生産性をログ化。</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3" id="downloads">
                        <a
                            href="/docs/JAC_Alpha_Requirements_1Pager.md"
                            className="flex items-center gap-2 rounded-xl px-4 py-3 bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
                        >
                            <Download size={16} /> 仕様1-Pager (α)
                        </a>
                        <a
                            href="/docs/JAC_Accommodation_Catalog_v0_3.yaml"
                            className="flex items-center gap-2 rounded-xl px-4 py-3 bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
                        >
                            <Download size={16} /> 配慮カタログ (YAML)
                        </a>
                    </div>
                    <figure className="block rounded-2xl overflow-hidden border border-gray-200 mt-4 shadow-sm w-full">
                        <Image
                            src="/images/ICF.webp"
                            alt="ICF Model"
                            width={672}
                            height={420}
                            className="w-full h-auto bg-white"
                        />
                    </figure>
                </div>

                {/* RIGHT */}
                <div className="space-y-6">
                    <div className="rounded-3xl border border-gray-200 bg-white shadow-xl overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                            <h4 className="font-semibold text-gray-900">JAC ワークフロー</h4>
                        </div>
                        <div className="p-6 grid gap-6">
                            {/* Step 1 */}
                            <div className="relative pl-8 border-l-2 border-indigo-100 last:border-0 pb-6 last:pb-0">
                                <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-600 ring-4 ring-indigo-50" />
                                <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1 block">Step 1</span>
                                <h5 className="font-bold text-gray-900 mb-1">配慮設計 (Design)</h5>
                                <p className="text-sm text-gray-600">カタログから候補を選択し、業務への適合性をチェック。</p>
                            </div>
                            {/* Step 2 */}
                            <div className="relative pl-8 border-l-2 border-indigo-100 last:border-0 pb-6 last:pb-0">
                                <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-600 ring-4 ring-indigo-50" />
                                <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1 block">Step 2</span>
                                <h5 className="font-bold text-gray-900 mb-1">合意形成 (Agreement)</h5>
                                <p className="text-sm text-gray-600">自動生成されたドラフトを元に、三者間ですり合わせ。</p>
                            </div>
                            {/* Step 3 */}
                            <div className="relative pl-8 border-l-2 border-indigo-100 last:border-0 pb-0 last:pb-0">
                                <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-600 ring-4 ring-indigo-50" />
                                <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1 block">Step 3</span>
                                <h5 className="font-bold text-gray-900 mb-1">運用・KPI (Implement)</h5>
                                <p className="text-sm text-gray-600">日々の記録と振り返りで、配慮を最適化し続ける。</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h4 className="font-semibold text-gray-900 mb-4">Sample Accommodations</h4>
                        <div className="flex flex-wrap gap-2">
                            {[
                                '短時間勤務・可変コア', '在宅・ハイブリッド',
                                'ペース配分調整', '温度・空調調整',
                                'ノイズキャンセル', '音声入力・読み上げ',
                                'タスクローテーション', '座席位置配慮',
                                '非同期コミュニケーション', '通勤ラッシュ回避',
                                '安全タスク制限', '視覚情報調整',
                            ].map((t, i) => (
                                <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100 text-xs text-gray-700">
                                    <Check size={12} className="text-teal-500" /> {t}
                                </span>
                            ))}
                        </div>
                        <div className="mt-6 flex flex-col sm:flex-row gap-3">
                            <a href="#poc" className="flex-1 text-center rounded-xl px-4 py-3 bg-gray-900 text-white text-sm font-bold shadow-lg hover:shadow-xl hover:bg-black transition-all">
                                PoC相談・見積もり
                            </a>
                            <a href="#pricing" className="flex-1 text-center rounded-xl px-4 py-3 bg-white border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">
                                料金プラン
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
