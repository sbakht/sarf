import { VoiceKey } from "@/components/VoiceKey";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { SpotterChoice, SpotterStep } from "@/lib/sarf";

export function SpotterStep({
  current,
  step,
  total,
  onAnswer,
}: {
  current: SpotterStep;
  step: number;
  total: number;
  onAnswer: (choice: SpotterChoice) => void;
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
                <span className="text-sm text-muted-foreground">
                  {choice.secondary}
                </span>
              ) : null}
            </Button>
          ))}
        </div>
        {current.id === "voice" ? (
          <Collapsible className="mt-4 rounded-xl border border-border bg-muted/50 px-4 py-3 text-start">
            <CollapsibleTrigger className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
              Voice key — how to tell معلوم from مجهول
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <VoiceKey compact />
            </CollapsibleContent>
          </Collapsible>
        ) : null}
      </CardContent>
    </Card>
  );
}
