"use client";

import { useSettings } from "@/components/SettingsProvider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SpotterCard } from "./SpotterCard";
import { SpotterFilters } from "./SpotterFilters";
import { SpotterStep } from "./SpotterStep";
import { useSpotterQuiz } from "./useSpotterQuiz";

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

function RoundControls({ quiz }: { quiz: ReturnType<typeof useSpotterQuiz> }) {
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

export function SpotterView() {
  const quiz = useSpotterQuiz();
  const { setLabelMode } = useSettings();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="kicker">Pattern Spotter</p>
        <h1 className="mt-1 text-3xl font-semibold">Name what you see</h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(18rem,22rem)_1fr]">
        <SpotterFilters
          labelMode={quiz.labelMode}
          enabledQuestions={quiz.enabledQuestions}
          enabledForms={quiz.enabledForms}
          enabledTenses={quiz.enabledTenses}
          enabledVoices={quiz.enabledVoices}
          enabledPersons={quiz.enabledPersons}
          onLabelModeChange={setLabelMode}
          onToggleQuestion={quiz.toggleQuestion}
          onToggleForm={quiz.toggleForm}
          onToggleTense={quiz.toggleTense}
          onToggleVoice={quiz.toggleVoice}
          onTogglePerson={quiz.togglePerson}
          onTogglePersonSet={quiz.togglePersonSet}
          onSelectAllQuestions={quiz.selectAllQuestions}
          onSelectAllPersons={quiz.selectAllPersons}
        />

        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <label className="flex items-center gap-2">
              <Checkbox
                id="include-weak"
                checked={quiz.includeWeak}
                onCheckedChange={(checked) =>
                  quiz.setIncludeWeak(checked === true)
                }
              />
              Include weak verbs
            </label>
            <p className="ml-auto font-heading font-semibold text-energy">
              Score {quiz.score.correct}/{quiz.score.total}
            </p>
          </div>

          <SpotterCard
            prompt={quiz.prompt}
            result={quiz.result}
            feedback={quiz.feedback}
            showColors={quiz.showColors}
            done={quiz.done}
          />

          <RoundControls quiz={quiz} />
        </div>
      </div>
    </div>
  );
}
