"use client";

import { SpotterCard } from "./SpotterCard";
import { SpotterFilters } from "./SpotterFilters";
import { SpotterStep } from "./SpotterStep";
import { useSpotterQuiz } from "./useSpotterQuiz";
import type { ReactNode } from "react";

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
    <button
      type="button"
      className="self-start rounded-full bg-accent px-5 py-2 text-paper"
      onClick={onClick}
    >
      {label}
      {hint ? <span className="text-xs opacity-80">{hint}</span> : null}
    </button>
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

  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="text-sm uppercase tracking-[0.2em] text-accent">
          Pattern Spotter
        </p>
        <h1 className="mt-1 text-3xl font-semibold">Name what you see</h1>
      </header>

      <div className="flex flex-wrap gap-3 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={quiz.includeWeak}
            onChange={(e) => quiz.setIncludeWeak(e.target.checked)}
          />
          Include weak verbs
        </label>
        <p className="ml-auto text-ink-soft">
          Score {quiz.score.correct}/{quiz.score.total}
        </p>
      </div>

      <SpotterFilters
        labelMode={quiz.labelMode}
        enabledQuestions={quiz.enabledQuestions}
        enabledForms={quiz.enabledForms}
        enabledTenses={quiz.enabledTenses}
        enabledVoices={quiz.enabledVoices}
        enabledPersons={quiz.enabledPersons}
        onToggleQuestion={quiz.toggleQuestion}
        onToggleForm={quiz.toggleForm}
        onToggleTense={quiz.toggleTense}
        onToggleVoice={quiz.toggleVoice}
        onTogglePerson={quiz.togglePerson}
        onSelectAllQuestions={quiz.selectAllQuestions}
        onSelectAllForms={quiz.selectAllForms}
        onSelectAllTenses={quiz.selectAllTenses}
        onSelectAllVoices={quiz.selectAllVoices}
        onSelectAllPersons={quiz.selectAllPersons}
      />

      <SpotterCard
        prompt={quiz.prompt}
        result={quiz.result}
        feedback={quiz.feedback}
        showColors={quiz.showColors}
        done={quiz.done}
      />

      <RoundControls quiz={quiz} />
    </div>
  );
}
