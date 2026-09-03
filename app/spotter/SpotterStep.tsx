import { VoiceKey } from "@/components/VoiceKey";
import type { SpotterChoice, SpotterStep } from "@/lib/sarf";

export function SpotterStep({
  current,
  step,
  total,
  onAnswer,
}: {
  current: SpotterStep;
  step: number;
  total: number;
  onAnswer: (choice: SpotterChoice) => void;
}) {
  const arabicClass =
    current.id === "root" ? "font-arabic text-2xl" : "font-arabic text-xl";

  return (
    <section className="rounded-2xl border border-rule bg-card p-5">
      <p className="text-xs uppercase tracking-wider text-ink-soft">
        Step {step + 1} / {total} · keys 1–{current.choices.length}
      </p>
      <h2 className="mt-1 text-xl font-semibold">{current.title}</h2>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {current.choices.map((choice, index) => (
          <button
            key={choice.id}
            type="button"
            className="relative flex flex-col items-center gap-1 rounded-2xl border border-rule bg-paper px-4 py-3 hover:border-accent"
            onClick={() => onAnswer(choice)}
          >
            <span className="absolute start-3 top-2 text-xs text-ink-soft">
              {index + 1}
            </span>
            {choice.arabic ? (
              <span dir="rtl" className={arabicClass}>
                {choice.primary}
              </span>
            ) : (
              choice.primary
            )}
            {choice.secondary ? (
              <span className="text-sm text-ink-soft">{choice.secondary}</span>
            ) : null}
          </button>
        ))}
      </div>
      {current.id === "voice" ? (
        <details className="mt-4 rounded-2xl border border-rule bg-paper/50 px-4 py-3 text-start">
          <summary className="cursor-pointer text-sm text-ink-soft hover:text-ink">
            Voice key — how to tell معلوم from مجهول
          </summary>
          <div className="mt-3">
            <VoiceKey compact />
          </div>
        </details>
      ) : null}
    </section>
  );
}
