"use client";

import { conjugate, PERSON_BY_ID, TABLE_ROWS, type ConjugateInput, type PersonId } from "@/lib/sarf";
import { ArabicWord } from "./ArabicWord";

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
    <div className="overflow-x-auto rounded-2xl border border-rule bg-card">
      <table className="w-full min-w-[36rem] border-collapse text-center">
        <thead>
          <tr className="bg-paper-deep/60 text-xs uppercase tracking-wider text-ink-soft">
            <th className="p-3 text-left font-medium">Person</th>
            {cols.map((col) => (
              <th key={col} className="p-3 font-medium">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TABLE_ROWS.map((row) => (
            <tr key={row.label} className="border-t border-rule">
              <th className="p-3 text-left text-sm font-medium text-ink-soft">{row.label}</th>
              {row.label === "1st" ? (
                <>
                  <td className="p-2">
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
                  <td className="p-2 text-ink-soft">—</td>
                  <td className="p-2">
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
                  <td key={person} className="p-2">
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
    </div>
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
      className={`w-full rounded-xl px-2 py-2 ${isSelected ? "ring-2 ring-accent" : ""} ${
        onSelect || onToggleReveal ? "cursor-pointer hover:bg-paper-deep/50" : ""
      }`}
      onClick={() => {
        onSelect?.(person);
        if (quiz && result.available) onToggleReveal?.(person);
      }}
      aria-label={
        covered ? `Reveal ${info.english}` : `${info.english}: ${result.surface}`
      }
    >
      <div dir="rtl" className="font-arabic text-xs text-ink-soft">
        {info.arabic}
      </div>
      {covered ? (
        <span className="mt-1 flex min-h-8 items-center justify-center rounded-lg border border-dashed border-rule bg-paper-deep/40 text-xs text-ink-soft">
          tap to reveal
        </span>
      ) : (
        <ArabicWord slots={result.slots} surface={result.surface} size="md" />
      )}
    </button>
  );
}
