import Link from 'next/link';
import React from 'react';

export default function TrustStrip() {
    const links = [
        { label: '当事者・企業・支援者協働', href: '#vision' },
        { label: 'ICF / EBPM 基盤', href: '/docs/houkoku126_summary.pdf' },
        { label: '合理的配慮の標準化 (JAC)', href: '#product' },
        { label: '講義・政策・実装の一体化', href: '#services' },
        { label: 'オープンアクセス (CC BY 4.0)', href: 'https://creativecommons.org/licenses/by/4.0/deed.ja' },
        { label: '合意形成デザイン', href: '#vision' },
    ];

    return (
        <section aria-label="信頼の根拠" className="border-y border-gray-100 bg-white">
            <div className="mx-auto max-w-7xl px-6 py-4">
                <ul className="flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm justify-center md:justify-start">
                    {links.map((link, i) => (
                        <li key={i}>
                            <Link
                                href={link.href}
                                className="inline-flex items-center rounded-full border border-gray-100 px-3 py-1 bg-gray-50 hover:bg-gray-100 hover:border-gray-200 hover:text-indigo-600 transition-colors"
                                target={link.href.startsWith('http') ? '_blank' : undefined}
                                rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
