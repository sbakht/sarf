"use client";

import { usePathname } from "next/navigation";
import { useSettings } from "@/components/SettingsProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BugReportButton, bugReportSource } from "./BugReportButton";
import { QuizCard } from "./QuizCard";
import { QuizFilters } from "./QuizFilters";
import { QuizStep } from "./QuizStep";
import { useQuiz } from "./useQuiz";

function RoundControls({ quiz }: { quiz: ReturnType<typeof useQuiz> }) {
  if (!quiz.started) {
    return (
      <Card aria-hidden>
        <CardContent>
          <div className="min-h-40" />
        </CardContent>
      </Card>
    );
  }
  if (!quiz.prompt) {
    return (
      <Button
        variant="energy"
        size="lg"
        className="self-start rounded-full px-5"
        onClick={quiz.nextPrompt}
      >
        Try again
      </Button>
    );
  }
  if (quiz.done || !quiz.current) return null;
  return (
    <QuizStep
      current={quiz.current}
      step={quiz.step}
      total={quiz.steps.length}
      onAnswer={quiz.answer}
    />
  );
}

function filterSummary(quiz: ReturnType<typeof useQuiz>): string {
  return [
    `${quiz.enabledWeaknesses.length} root types`,
    `${quiz.enabledQuestions.length} questions`,
    `${quiz.enabledForms.length} forms`,
    `${quiz.enabledTenses.length} tenses`,
    `${quiz.enabledVoices.length} voices`,
    `${quiz.enabledPersons.length} pronouns`,
  ].join(" · ");
}

export function QuizView() {
  const quiz = useQuiz();
  const { setLabelMode } = useSettings();
  const pathname = usePathname() || "/";

  const filterProps = {
    labelMode: quiz.labelMode,
    enabledQuestions: quiz.enabledQuestions,
    enabledForms: quiz.enabledForms,
    enabledTenses: quiz.enabledTenses,
    enabledVoices: quiz.enabledVoices,
    enabledPersons: quiz.enabledPersons,
    enabledWeaknesses: quiz.enabledWeaknesses,
    enabledWeakLetters: quiz.enabledWeakLetters,
    onLabelModeChange: setLabelMode,
    onToggleQuestion: quiz.toggleQuestion,
    onToggleForm: quiz.toggleForm,
    onToggleTense: quiz.toggleTense,
    onToggleVoice: quiz.toggleVoice,
    onTogglePerson: quiz.togglePerson,
    onTogglePersonSet: quiz.togglePersonSet,
    onSelectAllPersons: quiz.selectAllPersons,
    onToggleWeakness: quiz.toggleWeakness,
    onToggleWeakLetter: quiz.toggleWeakLetter,
  };

  return (
    <div className="flex min-w-0 w-full flex-col gap-6">
      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(18rem,22rem)_1fr]">
        <div className="hidden min-w-0 lg:block">
          <QuizFilters {...filterProps} />
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <div className="min-w-0 lg:hidden">
            <QuizFilters
              {...filterProps}
              collapsible
              summary={filterSummary(quiz)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <p className="ml-auto font-heading font-semibold text-energy">
              Score {quiz.score.correct}/{quiz.score.total}
            </p>
          </div>

          <QuizCard
            prompt={quiz.prompt}
            result={quiz.result}
            feedback={quiz.feedback}
            showColors={quiz.showColors}
            done={quiz.done}
            pending={!quiz.started}
            onContinue={quiz.done && quiz.prompt ? quiz.nextPrompt : undefined}
          />

          <RoundControls quiz={quiz} />

          <BugReportButton
            source={bugReportSource(
              {
                labelMode: quiz.labelMode,
                enabledWeaknesses: quiz.enabledWeaknesses,
                enabledWeakLetters: quiz.enabledWeakLetters,
                enabledForms: quiz.enabledForms,
                enabledPersons: quiz.enabledPersons,
                enabledVoices: quiz.enabledVoices,
                enabledTenses: quiz.enabledTenses,
                enabledQuestions: quiz.enabledQuestions,
                score: quiz.score,
                step: quiz.step,
                done: quiz.done,
                prompt: quiz.prompt,
                result: quiz.result,
                current: quiz.current ?? null,
                steps: quiz.steps,
                feedback: quiz.feedback,
                answers: quiz.answers,
              },
              pathname,
            )}
          />
        </div>
      </div>
    </div>
  );
}
