import { ArrowRight, FileText, Video } from 'lucide-react';
import React from 'react';

export default function Reports() {
    const reports = [
        {
            title: '難病就労支援：国際比較2025 (速報)',
            desc: '制度と現場のベストプラクティスを8頁で凝縮。',
            href: '/docs/houkoku126_summary.pdf',
            color: 'from-indigo-50 to-sky-50',
        },
        {
            title: '雇用の質×合理的配慮：設計ガイド',
            desc: '非同期会議・在宅・温度/騒音配慮の実務手順。',
            href: '/docs/remote-accommodation.pdf',
            color: 'from-indigo-50 to-sky-50', // Reusing color for consistency, or change if needed
        },
        {
            title: '巻頭言：職業リハビリテーションの黄金期',
            desc: '2025/07 読み物版。',
            href: '/docs/01-巻頭言-春名.pdf',
            color: 'from-indigo-50 to-sky-50',
        },
    ];

    const slides = [
        {
            title: 'リハ協カフェ講演資料',
            desc: '2025/07/31 ウェブ講演スライド。',
            href: '/docs/リハ協カフェ20250731春名2.pdf',
            color: 'from-amber-50 to-emerald-50',
        },
        {
            title: '京都難病2025 プレゼン',
            desc: '企画スライド案 (PPTX)',
            href: '/docs/京都難病2025.pptx',
            color: 'from-amber-50 to-emerald-50',
        },
        {
            title: '難病患者の雇用促進：研究会まとめ',
            desc: '議論要旨と提案 (DOCX)',
            href: '/docs/難病患者の雇用促進に関する研究会の議論まとめ.docx',
            color: 'from-amber-50 to-emerald-50',
        },
    ];

    return (
        <section id="reports" data-testid="reports" className="mx-auto max-w-7xl px-6 py-16">
            <div className="flex items-end justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 border-l-4 border-indigo-500 pl-4">最新レポート・資料</h2>
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline">
                    すべて見る
                </a>
            </div>

            <div className="space-y-8">
                {/* Reports Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {reports.map((r, i) => (
                        <article key={i} className="group rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all bg-white flex flex-col">
                            <div className={`aspect-video bg-gradient-to-br ${r.color} flex items-center justify-center`}>
                                <FileText className="text-indigo-200/50 w-16 h-16 group-hover:scale-110 transition-transform" />
                            </div>
                            <div className="p-5 flex flex-col flex-1">
                                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{r.title}</h3>
                                <p className="text-sm text-gray-600 mb-4 flex-1">{r.desc}</p>
                                <div className="flex gap-4 pt-2 border-t border-gray-50 mt-auto">
                                    <a href={encodeURI(r.href)} className="text-sm font-medium text-indigo-600 flex items-center gap-1 hover:gap-2 transition-all">
                                        PDF <ArrowRight size={14} />
                                    </a>
                                    <a href="#video" className="text-sm font-medium text-gray-500 flex items-center gap-1 hover:text-indigo-600 transition-colors">
                                        <Video size={14} /> 解説動画
                                    </a>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Slides Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {slides.map((r, i) => (
                        <article key={i} className="group rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all bg-white flex flex-col">
                            <div className={`aspect-video bg-gradient-to-br ${r.color} flex items-center justify-center`}>
                                <Video className="text-emerald-200/50 w-16 h-16 group-hover:scale-110 transition-transform" />
                            </div>
                            <div className="p-5 flex flex-col flex-1">
                                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{r.title}</h3>
                                <p className="text-sm text-gray-600 mb-4 flex-1">{r.desc}</p>
                                <div className="flex gap-4 pt-2 border-t border-gray-50 mt-auto">
                                    <a href={encodeURI(r.href)} className="text-sm font-medium text-emerald-600 flex items-center gap-1 hover:gap-2 transition-all">
                                        資料DL <ArrowRight size={14} />
                                    </a>
                                    <a href="#join" className="text-sm font-medium text-gray-500 flex items-center gap-1 hover:text-emerald-600 transition-colors">
                                        内容の相談
                                    </a>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
