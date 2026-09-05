import { ArabicWord } from "@/components/ArabicWord";
import { FormBadge } from "@/components/FormBadge";
import { Card } from "@/components/ui/card";
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
  if (!feedback) return "";
  if (feedback.ok) return "ring-ok/40";
  return "ring-no/40";
}

export function SpotterCard({
  prompt,
  result,
  feedback,
  showColors,
  done,
  onContinue,
}: {
  prompt: Prompt | null;
  result: ConjugateResult | null;
  feedback: { ok: boolean; text: string } | null;
  showColors: boolean;
  done: boolean;
  onContinue?: () => void;
}) {
  const cardTone = cardToneClass(feedback);
  const continueHint = done && onContinue;

  const body = (
    <>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">
        {continueHint ? "Tap the verb to continue" : "Identify this verb"}
      </p>
      {prompt && result ? (
        <>
          <div
            className={`mt-4 ${continueHint ? "transition group-hover:scale-[1.03]" : ""}`}
          >
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
            <div className="mt-2 flex flex-col items-center gap-2 text-muted-foreground">
              <FormBadge form={prompt.form} />
              <p>
                {rootArabic(prompt.root)} · {prompt.tense} · {prompt.voice} ·{" "}
                {personQuizFeedback(prompt.person, prompt.tense)}
              </p>
              {continueHint ? (
                <p className="text-sm">or press Enter / Space</p>
              ) : null}
            </div>
          ) : null}
        </>
      ) : (
        <p className="mt-4 text-muted-foreground">
          No verbs match these filters
        </p>
      )}
    </>
  );

  if (continueHint) {
    return (
      <button
        type="button"
        onClick={onContinue}
        className={`group w-full rounded-xl border-2 border-dashed border-energy/60 bg-card px-6 py-10 text-center transition hover:border-energy hover:bg-energy/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-energy ${cardTone}`}
      >
        {body}
      </button>
    );
  }

  return <Card className={`px-6 py-10 text-center ${cardTone}`}>{body}</Card>;
}
