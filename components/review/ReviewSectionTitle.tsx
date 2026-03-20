import type { ReactNode } from 'react';

type ReviewSectionTitleProps = {
  icon?: ReactNode;
  eyebrow?: string;
  title: string;
  description?: string;
};

export function ReviewSectionTitle({
  icon,
  eyebrow,
  title,
  description,
}: ReviewSectionTitleProps) {
  return (
    <div className="flex items-start gap-3">
      {icon ? <div className="mt-1 shrink-0">{icon}</div> : null}
      <div>
        {eyebrow ? (
          <p className="text-sm font-semibold tracking-[0.14em] text-slate-500">{eyebrow}</p>
        ) : null}
        <h2 className="mt-1 text-2xl font-black text-slate-950">{title}</h2>
        {description ? (
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700">{description}</p>
        ) : null}
      </div>
    </div>
  );
}
