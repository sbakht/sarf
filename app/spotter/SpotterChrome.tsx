"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SpotterStep } from "./SpotterStep";
import { useSpotterQuiz } from "./useSpotterQuiz";

export function WeakAndScore({ quiz }: { quiz: ReturnType<typeof useSpotterQuiz> }) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <label className="flex items-center gap-2">
        <Checkbox
          id="include-weak"
          checked={quiz.includeWeak}
          onCheckedChange={(checked) => quiz.setIncludeWeak(checked === true)}
        />
        Include weak verbs
      </label>
      <p className="ml-auto font-heading font-semibold text-energy">
        Score {quiz.score.correct}/{quiz.score.total}
      </p>
    </div>
  );
}

function NextButton({
  label,
  hint,
  onClick,
}: {
  label: string;
  hint?: string;
  onClick: () => void;
}) {
  return (
    <Button
      variant="energy"
      size="lg"
      className="self-start rounded-full px-5"
      onClick={onClick}
    >
      {label}
      {hint ? <span className="text-xs opacity-80">{hint}</span> : null}
    </Button>
  );
}

export function RoundControls({
  quiz,
}: {
  quiz: ReturnType<typeof useSpotterQuiz>;
}) {
  if (!quiz.prompt) {
    return <NextButton label="Try again" onClick={quiz.nextPrompt} />;
  }
  if (!quiz.done && quiz.current) {
    return (
      <SpotterStep
        current={quiz.current}
        step={quiz.step}
        total={quiz.steps.length}
        onAnswer={quiz.answer}
      />
    );
  }
  return (
    <NextButton
      label="Next verb "
      hint="(Enter / Space)"
      onClick={quiz.nextPrompt}
    />
  );
}
