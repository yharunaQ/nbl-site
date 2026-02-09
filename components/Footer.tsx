import Link from 'next/link';
import React from 'react';

export default function Footer() {
    return (
        <footer id="contact" className="border-t border-gray-200 bg-gray-50 scroll-mt-24">
            <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16 grid md:grid-cols-4 gap-8 md:gap-12 items-start text-sm text-gray-600">
                <div className="md:col-span-2 space-y-4">
                    <div className="font-bold text-gray-900 text-lg flex items-center gap-2">
                        Next Being Lab
                    </div>
                    <p className="leading-relaxed">
                        Justice & Innovation for a Generative, Equitable Era.<br />
                        私たちは、AI×包摂を社会インフラ化する実証と標準化のラボです。
                    </p>
                    <div className="pt-4">
                        <p className="text-xs text-gray-500 mb-2">
                            このサイトのコンテンツは <a href="https://creativecommons.org/licenses/by/4.0/deed.ja" target="_blank" rel="noreferrer" className="underline hover:text-indigo-600">CC BY 4.0</a> で提供しています。
                        </p>
                        <p className="text-xs text-gray-500">
                            © {new Date().getFullYear()} Next Being Lab
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="font-bold text-gray-900 mb-1">利用ガイド</div>
                    <a href="#phase1" className="hover:text-indigo-600 transition-colors">NBL (Phase 1)</a>
                    <a href="#product" className="hover:text-indigo-600 transition-colors">JAC (Product)</a>
                    <Link href="/jac" className="hover:text-indigo-600 transition-colors">JAC試用版</Link>
                    <a href="#services" className="hover:text-indigo-600 transition-colors">Services & Pricing</a>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="font-bold text-gray-900 mb-1">リソース</div>
                    <a href="#reports" className="hover:text-indigo-600 transition-colors">レポート・資料</a>
                    <a href="#campaign" className="hover:text-indigo-600 transition-colors">Campaign</a>
                    <Link href="/blog" className="hover:text-indigo-600 transition-colors">Founder’s Blog</Link>
                    <a href="mailto:info@nextbeinglab.org" className="mt-2 inline-flex font-medium text-indigo-600 hover:text-indigo-700">
                        Contact Us
                    </a>
                </div>
            </div>
        </footer>
    );
}
