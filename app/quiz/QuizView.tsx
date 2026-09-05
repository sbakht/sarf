"use client";

import { useSettings } from "@/components/SettingsProvider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SpotterCard } from "@/app/spotter/SpotterCard";
import { SpotterFilters } from "@/app/spotter/SpotterFilters";
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
  const { setLabelMode } = useSettings();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
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
            onContinue={quiz.done && quiz.prompt ? quiz.nextPrompt : undefined}
          />

          <RoundControls quiz={quiz} />
        </div>
      </div>
    </div>
  );
}
