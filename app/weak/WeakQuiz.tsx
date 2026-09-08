"use client";

import Link from "next/link";
import { ArabicWord } from "@/components/ArabicWord";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  COURSE_KIND_META,
  MUTATION_META,
  conjugateCourse,
  courseKind,
  mutationId,
  rootArabic,
  type WeakPrompt,
} from "@/lib/sarf";
import type { useLessonQuiz } from "@/app/lessons/useLessonQuiz";
import { QuizStep } from "@/app/quiz/QuizStep";

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

export function WeakQuiz({
  quiz,
  next,
}: {
  quiz: ReturnType<typeof useLessonQuiz<WeakPrompt>>;
  next?: { slug: string; title: string } | null;
}) {
  const reveal = quiz.showColors || quiz.complete || quiz.awaitingContinue;
  const analog = quiz.prompt ? conjugateCourse(quiz.prompt, true) : null;
  const kind = quiz.prompt
    ? COURSE_KIND_META[courseKind(quiz.prompt.root.weakness)]
    : null;
  const rule = quiz.prompt ? mutationId(quiz.prompt) : "none";

  return (
    <div className="flex min-w-0 max-w-2xl flex-col gap-4">
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
          "px-6 py-8",
          quiz.feedback?.ok === true && "ring-ok/40",
          quiz.feedback?.ok === false && "ring-no/40",
        )}
      >
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          {quiz.complete
            ? "Sitting complete"
            : quiz.awaitingContinue
              ? "Tap continue for the next verb"
              : (quiz.prompt?.label ?? "Identify this cell")}
        </p>
        {quiz.prompt ? (
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Root
                </p>
                <p dir="rtl" className="font-arabic text-3xl">
                  {rootArabic(quiz.prompt.root).split("").join(" ")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {quiz.prompt.root.gloss}
                  {reveal && kind ? ` · ${kind.arabic} ${kind.title}` : null}
                </p>
              </div>
              {analog ? (
                <div className="text-end">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    Sound analog
                  </p>
                  <ArabicWord
                    slots={analog.slots}
                    surface={analog.surface}
                    size="lg"
                  />
                </div>
              ) : null}
            </div>
            {reveal && quiz.result ? (
              <div className="rounded-xl bg-muted px-4 py-3">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Actual
                </p>
                <ArabicWord
                  slots={quiz.result.slots}
                  surface={quiz.result.surface}
                  size="xl"
                />
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {MUTATION_META[rule].primary}. {MUTATION_META[rule].secondary}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Start from the analog — the shape you would produce if this were
                a سالم verb — then apply the mutation.
              </p>
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
              {next
                ? "Drill this sitting again, or continue to the next chapter."
                : "You have finished the weak-verb path. Keep drilling, or open the Lab to compare more cells."}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="energy"
                className="rounded-full"
                onClick={quiz.restart}
              >
                Try again
              </Button>
              {next ? (
                <Link
                  href={`/weak/${next.slug}`}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "rounded-full",
                  )}
                >
                  Next: {next.title}
                </Link>
              ) : (
                <Link
                  href="/lab"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "rounded-full",
                  )}
                >
                  Weak Verb Lab
                </Link>
              )}
              <Link
                href="/weak"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "rounded-full",
                )}
              >
                Course map
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
        <QuizStep
          current={quiz.current}
          step={quiz.step}
          total={quiz.steps.length}
          onAnswer={quiz.answer}
        />
      ) : null}
    </div>
  );
}
