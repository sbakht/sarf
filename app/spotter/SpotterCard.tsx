import { ArabicWord } from "@/components/ArabicWord";
import { FormBadge } from "@/components/FormBadge";
import {
  personQuizFeedback,
  rootArabic,
  type ConjugateResult,
  type Prompt,
} from "@/lib/sarf";

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="size-4 shrink-0"
      fill="none"
    >
      <path
        d="M3.5 8.5 6.5 11.5 12.5 4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="size-4 shrink-0"
      fill="none"
    >
      <path
        d="M4 4 12 12M12 4 4 12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function cardToneClass(feedback: { ok: boolean } | null): string {
  if (!feedback) return "border-rule";
  if (feedback.ok) return "border-ok ring-2 ring-ok/30";
  return "border-no ring-2 ring-no/30";
}

export function SpotterCard({
  prompt,
  result,
  feedback,
  showColors,
  done,
}: {
  prompt: Prompt | null;
  result: ConjugateResult | null;
  feedback: { ok: boolean; text: string } | null;
  showColors: boolean;
  done: boolean;
}) {
  const cardTone = cardToneClass(feedback);

  return (
    <section
      className={`rounded-3xl border bg-card px-6 py-10 text-center ${cardTone}`}
    >
      <p className="text-xs uppercase tracking-wider text-ink-soft">
        Identify this verb
      </p>
      {prompt && result ? (
        <>
          <div className="mt-4">
            {showColors || done ? (
              <ArabicWord
                slots={result.slots}
                surface={result.surface}
                size="xl"
              />
            ) : (
              <span dir="rtl" className="font-arabic text-5xl">
                {result.surface}
              </span>
            )}
          </div>
          <div className="mt-4 flex min-h-10 items-center justify-center">
            {feedback ? (
              <p
                aria-live="polite"
                className={`flex w-fit items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold ${
                  feedback.ok ? "bg-ok/15 text-ok" : "bg-no/15 text-no"
                }`}
              >
                {feedback.ok ? <CheckIcon /> : <XIcon />}
                {feedback.text}
              </p>
            ) : null}
          </div>
          {done ? (
            <div className="mt-2 flex flex-col items-center gap-2 text-ink-soft">
              <FormBadge form={prompt.form} />
              <p>
                {rootArabic(prompt.root)} · {prompt.tense} · {prompt.voice} ·{" "}
                {personQuizFeedback(prompt.person, prompt.tense)}
              </p>
            </div>
          ) : null}
        </>
      ) : (
        <p className="mt-4 text-ink-soft">No verbs match these filters</p>
      )}
    </section>
  );
}
