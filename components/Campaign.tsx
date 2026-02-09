import { ArrowRight, Download, Play, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function Campaign() {
    return (
        <section
            id="campaign"
            data-testid="campaign"
            className="mx-auto max-w-7xl px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center scroll-mt-24"
        >
            {/* Left: Visual */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200 group">
                <Image
                    src="/images/can-by-design-hero.png"
                    alt="CAN BY DESIGN Visualization"
                    width={1280}
                    height={720}
                    className="w-full h-auto transform transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-8">
                    <div className="text-white">
                        <div className="flex items-center gap-2 mb-2 font-bold uppercase tracking-wider text-sm opacity-80">
                            <Play size={16} fill="currentColor" /> Campaign Movie
                        </div>
                        <p className="text-sm opacity-90">“できる”は、設計で生まれる。</p>
                    </div>
                </div>
            </div>

            {/* Right: Content */}
            <div className="space-y-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-bold uppercase tracking-wider mb-4">
                        Campaign
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-2 text-gray-900">
                        CAN BY DESIGN
                    </h2>
                    <p className="text-xl text-gray-500 font-medium">できるは、設計で生まれる。</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                        Design <ArrowRight size={14} className="text-gray-400" />
                        Agreement <ArrowRight size={14} className="text-gray-400" />
                        Implementation <ArrowRight size={14} className="text-gray-400" />
                        KPI
                    </div>
                    <p className="text-xs text-gray-600">“運用できる公平” を標準機能に。</p>
                </div>

                <p className="text-gray-700 leading-relaxed">
                    診断名ではなく、<span className="font-bold text-teal-600">タスク条件×症状像</span>で配慮を設計。
                    UIのスイッチをONにするように「温度・騒音・非同期・ペース」を調整し、
                    <span className="font-bold text-gray-900 px-1 bg-teal-50 rounded">調整後の実力 (Adjusted Merit)</span>で評価します。
                </p>

                <ul className="space-y-3">
                    {[
                        '配慮は“善意”ではなく“仕様”へ',
                        '合意文書を自動整形、KPIで透明化',
                        '人が決める／AIが支える (Human-in-Command)'
                    ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-gray-700 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                            {item}
                        </li>
                    ))}
                </ul>

                <div className="flex flex-wrap gap-4 pt-4">
                    <Link href="/jac" className="inline-flex items-center gap-2 rounded-xl px-6 py-3 bg-gray-900 text-white font-bold shadow-lg hover:shadow-xl hover:bg-black transition-all">
                        JAC試用版を使う <Zap size={18} className="text-teal-400" fill="currentColor" />
                    </Link>
                    <a href="/docs/CAN_BY_DESIGN_Brief.pdf" className="inline-flex items-center gap-2 rounded-xl px-5 py-3 bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                        <Download size={18} /> 概要PDF
                    </a>
                </div>
            </div>
        </section>
    );
}
