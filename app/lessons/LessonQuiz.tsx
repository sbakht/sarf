"use client";

import Link from "next/link";
import { ArabicWord } from "@/components/ArabicWord";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { useLessonQuiz } from "./useLessonQuiz";
import type { QuizChoice } from "@/lib/sarf";

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
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LessonQuiz<P>({
  quiz,
  nextLesson,
}: {
  quiz: ReturnType<typeof useLessonQuiz<P>>;
  nextLesson?: { slug: string; title: string } | null;
}) {
  const showColors = quiz.showColors || quiz.complete || quiz.awaitingContinue;

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <p className="text-muted-foreground">
          Verb {Math.min(quiz.round + 1, quiz.rounds)} / {quiz.rounds}
        </p>
        <p className="ml-auto font-heading font-semibold text-energy">
          Score {quiz.score.correct}/{quiz.score.total}
        </p>
      </div>

      <Card
        className={cn(
          "px-6 py-10 text-center",
          quiz.feedback?.ok === true && "ring-ok/40",
          quiz.feedback?.ok === false && "ring-no/40",
        )}
      >
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          {quiz.complete
            ? "Sitting complete"
            : quiz.awaitingContinue
              ? "Tap continue for the next verb"
              : "Identify this verb"}
        </p>
        {quiz.result ? (
          <div className="mt-4">
            {showColors ? (
              <ArabicWord
                slots={quiz.result.slots}
                surface={quiz.result.surface}
                size="xl"
              />
            ) : (
              <span dir="rtl" className="font-arabic text-5xl">
                {quiz.result.surface}
              </span>
            )}
          </div>
        ) : (
          <p className="mt-4 text-muted-foreground">No verb available</p>
        )}
        <div className="mt-4 flex min-h-10 items-center justify-center">
          {quiz.feedback ? (
            <p
              aria-live="polite"
              className={cn(
                "flex w-fit items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold",
                quiz.feedback.ok ? "bg-ok/15 text-ok" : "bg-no/15 text-no",
              )}
            >
              {quiz.feedback.ok ? <CheckIcon /> : <XIcon />}
              {quiz.feedback.text}
            </p>
          ) : null}
        </div>
      </Card>

      {quiz.complete ? (
        <Card>
          <CardContent className="flex flex-col gap-3">
            <p className="text-sm leading-6 text-muted-foreground">
              {nextLesson
                ? "You can keep drilling this sitting, continue to the next lesson, or open the Atlas."
                : "You can keep drilling this sitting, or open the Atlas to browse more patterns."}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="energy"
                className="rounded-full"
                onClick={quiz.restart}
              >
                Try again
              </Button>
              {nextLesson ? (
                <Link
                  href={`/lessons/${nextLesson.slug}`}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "rounded-full",
                  )}
                >
                  Next: {nextLesson.title}
                </Link>
              ) : null}
              <Link
                href="/atlas"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "rounded-full",
                )}
              >
                Atlas
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">
              Enter or Space also restarts.
            </p>
          </CardContent>
        </Card>
      ) : quiz.awaitingContinue ? (
        <Button
          variant="energy"
          size="lg"
          className="self-start rounded-full px-5"
          onClick={quiz.nextRound}
        >
          Continue
        </Button>
      ) : quiz.current ? (
        <Card>
          <CardContent>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Step {quiz.step + 1} / {quiz.steps.length} · keys 1–
              {quiz.current.choices.length}
            </p>
            <h2 className="mt-1 text-xl font-semibold">{quiz.current.title}</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {quiz.current.choices.map((choice: QuizChoice, index: number) => (
                <Button
                  key={choice.id}
                  variant="outline"
                  className="relative h-auto flex-col items-center gap-1 whitespace-normal rounded-xl bg-muted px-4 py-3 hover:border-primary"
                  onClick={() => quiz.answer(choice)}
                >
                  <span className="absolute start-3 top-2 text-xs text-muted-foreground">
                    {index + 1}
                  </span>
                  {choice.arabic ? (
                    <span dir="rtl" className="font-arabic text-2xl">
                      {choice.primary}
                    </span>
                  ) : (
                    choice.primary
                  )}
                  {choice.secondary ? (
                    <span
                      dir={choice.secondaryArabic ? "rtl" : undefined}
                      className={
                        choice.secondaryArabic
                          ? "font-arabic text-sm text-muted-foreground"
                          : "text-sm text-muted-foreground"
                      }
                    >
                      {choice.secondary}
                    </span>
                  ) : null}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
