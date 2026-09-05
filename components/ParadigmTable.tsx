"use client";

import {
  conjugate,
  PERSON_BY_ID,
  TABLE_ROWS,
  type ConjugateInput,
  type PersonId,
} from "@/lib/sarf";
import { ArabicWord } from "./ArabicWord";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ParadigmTable({
  input,
  quiz = false,
  revealedPersons = {},
  selected,
  onSelect,
  onToggleReveal,
}: {
  input: Omit<ConjugateInput, "person">;
  quiz?: boolean;
  revealedPersons?: Partial<Record<PersonId, boolean>>;
  selected?: PersonId | null;
  onSelect?: (person: PersonId) => void;
  onToggleReveal?: (person: PersonId) => void;
}) {
  const cols = ["Singular", "Dual", "Plural"] as const;

  return (
    <Card className="overflow-x-auto py-0">
      <table className="w-full min-w-[36rem] border-collapse text-center">
        <thead>
          <tr className="bg-muted/80 text-xs uppercase tracking-wider text-muted-foreground">
            <th className="p-2.5 text-left font-medium">Person</th>
            {cols.map((col) => (
              <th key={col} className="p-2.5 font-medium">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TABLE_ROWS.map((row) => (
            <tr key={row.label} className="border-t border-border">
              <th className="p-2.5 text-left text-sm font-medium text-muted-foreground">
                {row.label}
              </th>
              {row.label === "1st" ? (
                <>
                  <td className="p-1.5">
                    <PersonCell
                      person="ana"
                      input={input}
                      quiz={quiz}
                      revealed={Boolean(revealedPersons.ana)}
                      selected={selected}
                      onSelect={onSelect}
                      onToggleReveal={onToggleReveal}
                    />
                  </td>
                  <td className="p-1.5 text-muted-foreground">—</td>
                  <td className="p-1.5">
                    <PersonCell
                      person="nahnu"
                      input={input}
                      quiz={quiz}
                      revealed={Boolean(revealedPersons.nahnu)}
                      selected={selected}
                      onSelect={onSelect}
                      onToggleReveal={onToggleReveal}
                    />
                  </td>
                </>
              ) : (
                row.cells.map((person) => (
                  <td key={person} className="p-1.5">
                    <PersonCell
                      person={person}
                      input={input}
                      quiz={quiz}
                      revealed={Boolean(revealedPersons[person])}
                      selected={selected}
                      onSelect={onSelect}
                      onToggleReveal={onToggleReveal}
                    />
                  </td>
                ))
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function PersonCell({
  person,
  input,
  quiz,
  revealed,
  selected,
  onSelect,
  onToggleReveal,
}: {
  person: PersonId;
  input: Omit<ConjugateInput, "person">;
  quiz: boolean;
  revealed: boolean;
  selected?: PersonId | null;
  onSelect?: (person: PersonId) => void;
  onToggleReveal?: (person: PersonId) => void;
}) {
  const result = conjugate({ ...input, person });
  const info = PERSON_BY_ID[person];
  const isSelected = selected === person;
  const covered = quiz && result.available && !revealed;

  return (
    <button
      type="button"
      className={cn(
        "w-full rounded-lg px-2 py-2",
        isSelected && "ring-2 ring-primary",
        (onSelect || onToggleReveal) && "cursor-pointer hover:bg-muted/70",
      )}
      onClick={() => {
        onSelect?.(person);
        if (quiz && result.available) onToggleReveal?.(person);
      }}
      aria-label={
        covered
          ? `Reveal ${info.english}`
          : `${info.english}: ${result.surface}`
      }
    >
      <div dir="rtl" className="font-arabic text-xs text-muted-foreground">
        {info.arabic}
      </div>
      {covered ? (
        <span className="mt-1 flex min-h-8 items-center justify-center rounded-lg border border-dashed border-border bg-muted/60 text-xs text-muted-foreground">
          tap to reveal
        </span>
      ) : (
        <ArabicWord slots={result.slots} surface={result.surface} size="md" />
      )}
    </button>
  );
}
