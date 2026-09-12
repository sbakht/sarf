import { afterEach, describe, expect, it, vi } from "vitest";
import { conjugate, getRoot, type Prompt } from "@/lib/sarf";
import { handleBugReportRequest, bugReportConfigFromEnv } from "./handle";
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
  score: { correct: 0, total: 0 },
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
  current: null,
  steps: [],
  feedback: null,
  answers: [],
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("handleBugReportRequest", () => {
  it("rejects a payload without a snapshot", async () => {
    const response = await handleBugReportRequest(
      new Request("http://localhost/api/bug-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ happened: "something broke" }),
      }),
      { githubRepo: "sbakht/sarf" },
    );
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      ok: false,
      error: "Quiz snapshot is required",
    });
  });

  it("rejects invalid JSON", async () => {
    const response = await handleBugReportRequest(
      new Request("http://localhost/api/bug-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{not json",
      }),
      { githubRepo: "sbakht/sarf" },
    );
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      ok: false,
      error: "Quiz snapshot is required",
    });
  });

  it("returns 502 when GitHub cannot create the issue", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ message: "nope" }), { status: 403 }),
        ),
    );
    const response = await handleBugReportRequest(
      new Request("http://localhost/api/bug-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          happened: "The verb looks wrong",
          snapshot,
        }),
      }),
      { githubToken: "bad", githubRepo: "sbakht/sarf" },
    );
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({
      ok: false,
      error: "Could not create GitHub issue (403)",
    });
  });

  it("reads GitHub and Cursor credentials from the environment", () => {
    expect(
      bugReportConfigFromEnv({
        BUG_REPORT_GITHUB_TOKEN: "pat",
        BUG_REPORT_GITHUB_REPO: "sbakht/sarf",
        CURSOR_API_KEY: "cursor",
      }),
    ).toEqual({
      githubToken: "pat",
      githubRepo: "sbakht/sarf",
      cursorApiKey: "cursor",
    });
    expect(
      bugReportConfigFromEnv({
        GITHUB_TOKEN: "gha",
        GITHUB_REPO: "sbakht/sarf",
      }),
    ).toEqual({
      githubToken: "gha",
      githubRepo: "sbakht/sarf",
      cursorApiKey: undefined,
    });
  });

  it("creates the GitHub issue from the form payload", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            html_url: "https://github.com/sbakht/sarf/issues/3",
            number: 3,
          }),
          { status: 201, headers: { "Content-Type": "application/json" } },
        ),
      ),
    );

    const response = await handleBugReportRequest(
      new Request("http://localhost/api/bug-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          happened: "The verb looks wrong",
          expected: "It should be kataba",
          snapshot,
        }),
      }),
      { githubToken: "gh-token", githubRepo: "sbakht/sarf" },
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      ok: true,
      issueUrl: "https://github.com/sbakht/sarf/issues/3",
      issueNumber: 3,
    });
  });
});
