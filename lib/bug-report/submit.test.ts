import { afterEach, describe, expect, it, vi } from "vitest";
import { conjugate, getRoot, type Prompt } from "@/lib/sarf";
import { buildBugReportSnapshot } from "./snapshot";
import { submitBugReport } from "./submit";

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
    ],
  },
  steps: [],
  feedback: null,
  answers: [],
});

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("submitBugReport", () => {
  it("opens a GitHub issue then launches a Cursor agent to reproduce, fix, and PR", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse(201, {
          html_url: "https://github.com/sbakht/sarf/issues/42",
          number: 42,
        }),
      )
      .mockResolvedValueOnce(
        jsonResponse(201, {
          agent: {
            id: "bc-1",
            url: "https://cursor.com/agents/bc-1",
          },
        }),
      );
    vi.stubGlobal("fetch", fetchMock);

    const result = await submitBugReport(
      { happened: "Wrong form", snapshot },
      {
        githubToken: "gh-token",
        githubRepo: "sbakht/sarf",
        cursorApiKey: "cursor-key",
      },
    );

    expect(result).toEqual({
      ok: true,
      issueUrl: "https://github.com/sbakht/sarf/issues/42",
      issueNumber: 42,
      agentUrl: "https://cursor.com/agents/bc-1",
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);

    const [issueUrl, issueInit] = fetchMock.mock.calls[0] as [
      string,
      RequestInit,
    ];
    expect(issueUrl).toBe("https://api.github.com/repos/sbakht/sarf/issues");
    expect(issueInit.method).toBe("POST");
    expect(issueInit.headers).toMatchObject({
      Authorization: "Bearer gh-token",
      Accept: "application/vnd.github+json",
    });
    const issueBody = JSON.parse(String(issueInit.body)) as {
      title: string;
      body: string;
      labels: string[];
    };
    expect(issueBody.title).toBe("Wrong form");
    expect(issueBody.labels).toEqual(["bug"]);
    expect(issueBody.body).toContain("<!-- sarf-bug-report -->");
    expect(issueBody.body).toContain("<!-- agent: api -->");
    expect(issueBody.body).toContain("Wrong form");

    const [agentUrl, agentInit] = fetchMock.mock.calls[1] as [
      string,
      RequestInit,
    ];
    expect(agentUrl).toBe("https://api.cursor.com/v1/agents");
    expect(agentInit.method).toBe("POST");
    expect(agentInit.headers).toMatchObject({
      Authorization: "Bearer cursor-key",
    });
    const agentBody = JSON.parse(String(agentInit.body)) as {
      prompt: { text: string };
      repos: Array<{ url: string; startingRef: string }>;
      autoCreatePR: boolean;
    };
    expect(agentBody.autoCreatePR).toBe(true);
    expect(agentBody.repos[0]).toEqual({
      url: "https://github.com/sbakht/sarf",
      startingRef: "main",
    });
    expect(agentBody.prompt.text).toContain(
      "https://github.com/sbakht/sarf/issues/42",
    );
    expect(agentBody.prompt.text).toContain("Closes #42");
    expect(agentBody.prompt.text).toContain("Wrong form");
    expect(agentBody.prompt.text).toContain("Reproduce");
  });

  it("still creates the issue when no Cursor key is configured", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(
      jsonResponse(201, {
        html_url: "https://github.com/sbakht/sarf/issues/7",
        number: 7,
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await submitBugReport(
      { happened: "Broken quiz", snapshot },
      { githubToken: "gh-token", githubRepo: "sbakht/sarf" },
    );

    expect(result).toEqual({
      ok: true,
      issueUrl: "https://github.com/sbakht/sarf/issues/7",
      issueNumber: 7,
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const issueBody = JSON.parse(
      String((fetchMock.mock.calls[0] as [string, RequestInit])[1].body),
    ) as { body: string };
    expect(issueBody.body).not.toContain("<!-- agent: api -->");
  });

  it("returns a GitHub new-issue URL when no GitHub token is configured", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const result = await submitBugReport(
      { happened: "Broken quiz", snapshot },
      { githubRepo: "sbakht/sarf", cursorApiKey: "cursor-key" },
    );

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected ok");
    expect(result.issueUrl).toContain(
      "https://github.com/sbakht/sarf/issues/new?",
    );
    expect(result.issueUrl).toContain("title=");
    expect(result.issueUrl).toContain("body=");
    expect(result.issueUrl).toContain("labels=bug");
    expect(decodeURIComponent(result.issueUrl)).not.toContain(
      "<!-- agent: api -->",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns the issue even if the Cursor agent fails to launch", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse(201, {
          html_url: "https://github.com/sbakht/sarf/issues/9",
          number: 9,
        }),
      )
      .mockResolvedValueOnce(jsonResponse(500, { message: "nope" }));
    vi.stubGlobal("fetch", fetchMock);

    const result = await submitBugReport(
      { happened: "Broken quiz", expected: "It should work", snapshot },
      {
        githubToken: "gh-token",
        githubRepo: "sbakht/sarf",
        cursorApiKey: "cursor-key",
      },
    );

    expect(result).toEqual({
      ok: true,
      issueUrl: "https://github.com/sbakht/sarf/issues/9",
      issueNumber: 9,
    });
  });

  it("returns an error when GitHub rejects the issue", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(
          jsonResponse(401, { message: "Bad credentials" }),
        ),
    );

    const result = await submitBugReport(
      { happened: "Broken quiz", snapshot },
      { githubToken: "bad", githubRepo: "sbakht/sarf" },
    );

    expect(result).toEqual({
      ok: false,
      error: "Could not create GitHub issue (401)",
    });
  });
});
