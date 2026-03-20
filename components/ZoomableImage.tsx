'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Expand, ExternalLink, X } from 'lucide-react';

type ZoomableImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  buttonClassName?: string;
  imageClassName?: string;
  modalImageClassName?: string;
  zoomHint?: string;
};

export default function ZoomableImage({
  src,
  alt,
  width,
  height,
  fill = false,
  sizes,
  buttonClassName = '',
  imageClassName = '',
  modalImageClassName = '',
  zoomHint = 'クリックで拡大',
}: ZoomableImageProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const previewImage = fill ? (
    <span className="relative block h-full w-full">
      <Image src={src} alt={alt} fill sizes={sizes} className={imageClassName} />
    </span>
  ) : (
    <Image
      src={src}
      alt={alt}
      width={width ?? 2400}
      height={height ?? 1600}
      sizes={sizes}
      className={imageClassName}
    />
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`group relative block w-full text-left ${buttonClassName}`}
        aria-label={`${alt}を拡大して見る`}
      >
        {previewImage}
        <span className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full bg-slate-950/80 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-slate-950/30">
          <Expand size={14} />
          {zoomHint}
        </span>
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-[90] bg-slate-950/88 p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`${alt}の拡大表示`}
          onClick={() => setIsOpen(false)}
        >
          <div
            className="mx-auto flex h-full max-w-7xl flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-100">{alt}</p>
              <div className="flex flex-wrap gap-2">
                <a
                  href={src}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-500 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-slate-300 hover:bg-white/15"
                >
                  <ExternalLink size={16} />
                  画像を別タブで開く
                </a>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-500 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-300"
                >
                  <X size={16} />
                  閉じる
                </button>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 items-center justify-center rounded-[2rem] border border-white/10 bg-white/5 p-3 md:p-6">
              <img
                src={src}
                alt={alt}
                className={`max-h-full w-auto max-w-full object-contain ${modalImageClassName}`}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
