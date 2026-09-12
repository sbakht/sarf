import { describe, expect, it } from "vitest";
import { conjugate, getRoot, type Prompt } from "@/lib/sarf";
import { buildBugReportSnapshot } from "./snapshot";

const prompt: Prompt = {
  root: getRoot("ktb"),
  form: 1,
  tense: "past",
  voice: "active",
  person: "huwa",
};

const result = conjugate({
  root: prompt.root.letters,
  form: prompt.form,
  formIBab: prompt.root.formIBab,
  tense: prompt.tense,
  voice: prompt.voice,
  person: prompt.person,
  weakness: prompt.root.weakness,
});

describe("buildBugReportSnapshot", () => {
  it("captures filters, the current quiz question, and answers", () => {
    const snapshot = buildBugReportSnapshot({
      path: "/",
      labelMode: "both",
      enabledWeaknesses: ["sound", "ajwaf"],
      enabledWeakLetters: ["waw"],
      enabledForms: [1, 2],
      enabledPersons: ["huwa", "hiya"],
      enabledVoices: ["active"],
      enabledTenses: ["past"],
      enabledQuestions: ["root", "form"],
      score: { correct: 3, total: 5 },
      step: 1,
      done: false,
      prompt,
      result,
      current: {
        id: "form",
        title: "Which form?",
        choices: [
          {
            id: "1",
            primary: "Form I",
            correct: true,
            feedback: "Form I",
          },
          {
            id: "2",
            primary: "Form II",
            correct: false,
            feedback: "Form II",
          },
        ],
      },
      steps: [
        { id: "root", title: "Which root?", choices: [] },
        {
          id: "form",
          title: "Which form?",
          choices: [
            {
              id: "1",
              primary: "Form I",
              correct: true,
              feedback: "Form I",
            },
          ],
        },
      ],
      feedback: {
        ok: false,
        text: "Not quite — you said Form II; correct answer is Form I",
      },
      answers: [
        {
          question: "root",
          selected: "كتب",
          ok: true,
          correctLabel: "كتب",
        },
        {
          question: "form",
          selected: "Form II",
          ok: false,
          correctLabel: "Form I",
        },
      ],
    });

    expect(snapshot.filters).toEqual({
      enabledWeaknesses: ["sound", "ajwaf"],
      enabledWeakLetters: ["waw"],
      enabledForms: [1, 2],
      enabledPersons: ["huwa", "hiya"],
      enabledVoices: ["active"],
      enabledTenses: ["past"],
      enabledQuestions: ["root", "form"],
      labelMode: "both",
    });
    expect(snapshot.question).toMatchObject({
      path: "/",
      step: 1,
      done: false,
      prompt: {
        rootId: "ktb",
        rootArabic: "كتب",
        gloss: prompt.root.gloss,
        form: 1,
        tense: "past",
        voice: "active",
        person: "huwa",
      },
      surface: result.surface,
    });
    expect(snapshot.question.current?.id).toBe("form");
    expect(snapshot.answers).toEqual([
      {
        question: "root",
        selected: "كتب",
        ok: true,
        correctLabel: "كتب",
      },
      {
        question: "form",
        selected: "Form II",
        ok: false,
        correctLabel: "Form I",
      },
    ]);
    expect(snapshot.score).toEqual({ correct: 3, total: 5 });
  });
});
