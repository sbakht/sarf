import { ArabicWord } from "@/components/ArabicWord";
import { FormBadge } from "@/components/FormBadge";
import { Card, CardContent } from "@/components/ui/card";
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

export function QuizCard({
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
            <ArabicWord
              slots={result.slots}
              surface={result.surface}
              size="xl"
              colored={showColors || done}
            />
          </div>
          {/* Fixed slot so correct/incorrect feedback never shifts the step below (CLS). */}
          <div className="relative mt-2 h-10 shrink-0">
            {feedback ? (
              <p
                aria-live="polite"
                className={`absolute inset-x-0 top-1/2 mx-auto flex w-fit max-w-full -translate-y-1/2 items-center gap-2 rounded-lg px-3 py-1 text-sm font-bold leading-snug text-balance ${
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
        className="group w-full rounded-xl bg-card px-4 py-4 text-center ring-1 ring-foreground/10 transition hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {body}
      </button>
    );
  }

  return (
    <Card className="text-center">
      <CardContent>{body}</CardContent>
    </Card>
  );
}
