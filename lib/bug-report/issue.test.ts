import { describe, expect, it } from "vitest";
import { conjugate, getRoot, type Prompt } from "@/lib/sarf";
import { formatBugReportIssue } from "./issue";
import { buildBugReportSnapshot } from "./snapshot";

const prompt: Prompt = {
  root: getRoot("ktb"),
  form: 1,
  tense: "past",
  voice: "active",
  person: "huwa",
};

const snapshot = buildBugReportSnapshot({
  path: "/",
  labelMode: "both",
  enabledWeaknesses: ["sound"],
  enabledWeakLetters: ["waw", "ya"],
  enabledForms: [1],
  enabledPersons: ["huwa"],
  enabledVoices: ["active"],
  enabledTenses: ["past"],
  enabledQuestions: ["form"],
  score: { correct: 0, total: 1 },
  step: 0,
  done: false,
  prompt,
  result: conjugate({
    root: prompt.root.letters,
    form: prompt.form,
    formIBab: prompt.root.formIBab,
    tense: prompt.tense,
    voice: prompt.voice,
    person: prompt.person,
    weakness: prompt.root.weakness,
  }),
  current: {
    id: "form",
    title: "Which form?",
    choices: [
      { id: "1", primary: "Form I", correct: true, feedback: "Form I" },
      { id: "2", primary: "Form II", correct: false, feedback: "Form II" },
    ],
  },
  steps: [],
  feedback: {
    ok: false,
    text: "Not quite — you said Form II; correct answer is Form I",
  },
  answers: [
    {
      question: "form",
      selected: "Form II",
      ok: false,
      correctLabel: "Form I",
    },
  ],
});

describe("formatBugReportIssue", () => {
  it("builds a GitHub issue that includes the report, filters, question, and answers", () => {
    const issue = formatBugReportIssue({
      happened: "Form II was marked correct for كتب",
      expected: "Form I should be correct",
      snapshot,
    });

    expect(issue.title).toContain("Form II was marked correct for كتب");
    expect(issue.labels).toEqual(["bug"]);
    expect(issue.body).toContain("<!-- sarf-bug-report -->");
    expect(issue.body).toContain("Form II was marked correct for كتب");
    expect(issue.body).toContain("Form I should be correct");
    expect(issue.body).toContain("enabledForms");
    expect(issue.body).toContain("كتب");
    expect(issue.body).toContain("Form II");
    expect(issue.body).toContain("Form I");
    expect(issue.body).toContain("```json");
  });

  it("truncates a long title", () => {
    const happened = "x".repeat(100);
    const issue = formatBugReportIssue({ happened, snapshot });
    expect(issue.title).toHaveLength(80);
    expect(issue.title.endsWith("…")).toBe(true);
  });

  it("falls back to a generic title when the description is blank", () => {
    const issue = formatBugReportIssue({
      happened: "   ",
      snapshot,
    });
    expect(issue.title).toBe("Quiz bug report");
    expect(issue.body).toContain("_No description provided._");
    expect(issue.body).not.toContain("## Expected");
  });

  it("describes a missing prompt and unanswered round", () => {
    const empty = formatBugReportIssue({
      happened: "Nothing appeared",
      snapshot: {
        ...snapshot,
        question: {
          ...snapshot.question,
          prompt: null,
          surface: null,
          result: null,
          current: null,
          steps: [],
          feedback: null,
        },
        answers: [],
      },
    });
    expect(empty.body).toContain("No quiz prompt was on screen.");
    expect(empty.body).toContain("_No choices on screen._");
    expect(empty.body).toContain("_No answers submitted yet._");
  });
});
