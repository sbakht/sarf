import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { QuizChoice } from "@/lib/sarf";

type StepView = {
  id: string;
  title: string;
  choices: QuizChoice[];
};

export function QuizStep({
  current,
  step,
  total,
  onAnswer,
}: {
  current: StepView;
  step: number;
  total: number;
  onAnswer: (choice: QuizChoice) => void;
}) {
  const arabicClass =
    current.id === "root" ? "font-arabic text-2xl" : "font-arabic text-xl";

  return (
    <Card>
      <CardContent>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          Step {step + 1} / {total} · keys 1–{current.choices.length}
        </p>
        <h2 className="mt-1 text-xl font-semibold">{current.title}</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {current.choices.map((choice, index) => (
            <Button
              key={choice.id}
              variant="outline"
              className="relative h-auto flex-col items-center gap-1 whitespace-normal rounded-xl bg-muted px-4 py-3 hover:border-primary"
              onClick={() => onAnswer(choice)}
            >
              <span className="absolute start-3 top-2 text-xs text-muted-foreground">
                {index + 1}
              </span>
              {choice.arabic ? (
                <span dir="rtl" className={arabicClass}>
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
  );
}
