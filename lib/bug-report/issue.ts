import type { BugReportSnapshot } from "./snapshot";

export type BugReportIssueInput = {
  happened: string;
  expected?: string;
  snapshot: BugReportSnapshot;
};

export type BugReportIssue = {
  title: string;
  body: string;
  labels: string[];
};

const TITLE_MAX = 80;

function oneLine(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function issueTitle(happened: string): string {
  const trimmed = oneLine(happened);
  if (!trimmed) return "Quiz bug report";
  if (trimmed.length <= TITLE_MAX) return trimmed;
  return `${trimmed.slice(0, TITLE_MAX - 1)}…`;
}

function filterLine(snapshot: BugReportSnapshot): string {
  const { filters } = snapshot;
  return [
    `questions: ${filters.enabledQuestions.join(", ") || "none"}`,
    `forms: ${filters.enabledForms.join(", ") || "none"}`,
    `tenses: ${filters.enabledTenses.join(", ") || "none"}`,
    `voices: ${filters.enabledVoices.join(", ") || "none"}`,
    `pronouns: ${filters.enabledPersons.join(", ") || "none"}`,
    `root types: ${filters.enabledWeaknesses.join(", ") || "none"}`,
    `weak letters: ${filters.enabledWeakLetters.join(", ") || "none"}`,
    `labels: ${filters.labelMode}`,
  ].join("\n- ");
}

function questionLine(snapshot: BugReportSnapshot): string {
  const { prompt, surface, current, step, done } = snapshot.question;
  if (!prompt) return "No quiz prompt was on screen.";
  const verb = surface
    ? `${surface} (${prompt.rootArabic})`
    : prompt.rootArabic;
  const stepLabel = current
    ? `step ${step + 1} — ${current.title}`
    : done
      ? "round complete"
      : `step ${step + 1}`;
  return [
    `Verb: ${verb}`,
    `Root: ${prompt.rootId} · ${prompt.gloss}`,
    `Form ${prompt.form} · ${prompt.tense} · ${prompt.voice} · ${prompt.person}`,
    `Question: ${stepLabel}`,
  ].join("\n- ");
}

function answersBlock(snapshot: BugReportSnapshot): string {
  if (snapshot.answers.length === 0) return "_No answers submitted yet._";
  return snapshot.answers
    .map((answer) => {
      const mark = answer.ok ? "correct" : "incorrect";
      return `- **${answer.question}**: chose ${answer.selected} (${mark}; expected ${answer.correctLabel})`;
    })
    .join("\n");
}

function choicesBlock(snapshot: BugReportSnapshot): string {
  const current = snapshot.question.current;
  if (!current || current.choices.length === 0) {
    return "_No choices on screen._";
  }
  return current.choices
    .map((choice) => {
      const mark = choice.correct ? " ✓" : "";
      const secondary = choice.secondary ? ` · ${choice.secondary}` : "";
      return `- ${choice.primary}${secondary}${mark}`;
    })
    .join("\n");
}

export function formatBugReportIssue(
  input: BugReportIssueInput,
): BugReportIssue {
  const happened = input.happened.trim() || "_No description provided._";
  const expected = input.expected?.trim();
  const snapshotJson = JSON.stringify(input.snapshot, null, 2);

  const body = `<!-- sarf-bug-report -->
## What happened
${happened}

${expected ? `## Expected\n${expected}\n` : ""}## Quiz question
- ${questionLine(input.snapshot)}

## Choices on screen
${choicesBlock(input.snapshot)}

## Answers
${answersBlock(input.snapshot)}

## Selected filters
- ${filterLine(input.snapshot)}

## Score
${input.snapshot.score.correct}/${input.snapshot.score.total}

## Snapshot
\`\`\`json
${snapshotJson}
\`\`\`

## Agent instructions
Reproduce this quiz bug from the snapshot. Write a failing test first (TDD), then fix it, and open a pull request that closes this issue. Do not change unrelated behavior.
`;

  return {
    title: issueTitle(input.happened),
    body,
    labels: ["bug"],
  };
}
