import Link from "next/link";

export function ModeCard({
  href,
  kicker,
  title,
  arabic,
  body,
}: {
  href: string;
  kicker: string;
  title: string;
  arabic: string;
  body: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-3xl border border-rule bg-card p-6 transition hover:-translate-y-0.5 hover:border-accent"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.18em] text-accent">
          {kicker}
        </p>
        <span className="font-arabic text-2xl text-ink-soft">{arabic}</span>
      </div>
      <h2 className="mt-3 text-2xl font-semibold">{title}</h2>
      <p className="mt-2 text-ink-soft leading-7">{body}</p>
      <p className="mt-4 text-sm text-accent group-hover:underline">
        Open {title}
      </p>
    </Link>
  );
}
