"use client";

import { Button } from "@/components/ui/button";
import { SpotterCard } from "@/app/spotter/SpotterCard";
import { SpotterStep } from "@/app/spotter/SpotterStep";
import { useSpotterQuiz } from "@/app/spotter/useSpotterQuiz";

function RoundControls({ quiz }: { quiz: ReturnType<typeof useSpotterQuiz> }) {
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
    <SpotterStep
      current={quiz.current}
      step={quiz.step}
      total={quiz.steps.length}
      onAnswer={quiz.answer}
    />
  );
}

export function QuizView() {
  const quiz = useSpotterQuiz();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8">
      <p className="text-end text-sm font-heading font-semibold text-energy">
        Score {quiz.score.correct}/{quiz.score.total}
      </p>

      <SpotterCard
        prompt={quiz.prompt}
        result={quiz.result}
        feedback={quiz.feedback}
        showColors={quiz.showColors}
        done={quiz.done}
        onContinue={quiz.done && quiz.prompt ? quiz.nextPrompt : undefined}
      />

      <RoundControls quiz={quiz} />
    </div>
  );
}
