import { formatBugReportIssue, type BugReportIssueInput } from "./issue";

export type BugReportConfig = {
  githubToken?: string;
  githubRepo?: string;
  cursorApiKey?: string;
};

export type BugReportSuccess = {
  ok: true;
  issueUrl: string;
  issueNumber?: number;
  agentUrl?: string;
};

export type BugReportFailure = {
  ok: false;
  error: string;
};

export type BugReportResult = BugReportSuccess | BugReportFailure;

const DEFAULT_REPO = "sbakht/sarf";

function repoSlug(config: BugReportConfig): string {
  return config.githubRepo?.trim() || DEFAULT_REPO;
}

function newIssueUrl(
  repo: string,
  title: string,
  body: string,
  labels: string[],
): string {
  const params = new URLSearchParams({
    title,
    body,
    labels: labels.join(","),
  });
  return `https://github.com/${repo}/issues/new?${params.toString()}`;
}

function agentPrompt(input: {
  happened: string;
  expected?: string;
  issueUrl: string;
  issueNumber: number;
  snapshotJson: string;
}): string {
  const expected = input.expected?.trim();
  return `A user filed a quiz bug report. Reproduce it, write a failing test first (TDD), fix it, and open a pull request.

Issue: ${input.issueUrl}
The PR description must include "Closes #${input.issueNumber}".

What happened:
${input.happened.trim() || "(no description)"}
${expected ? `\nExpected:\n${expected}\n` : ""}
Reproduce from this snapshot of the selected filters, the quiz question, and the answers:

${input.snapshotJson}

Follow the repo's TDD rule. Do not change unrelated behavior.`;
}

async function createGitHubIssue(input: {
  token: string;
  repo: string;
  title: string;
  body: string;
  labels: string[];
}): Promise<
  { ok: true; htmlUrl: string; number: number } | { ok: false; status: number }
> {
  const response = await fetch(
    `https://api.github.com/repos/${input.repo}/issues`,
    {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${input.token}`,
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({
        title: input.title,
        body: input.body,
        labels: input.labels,
      }),
    },
  );
  if (!response.ok) return { ok: false, status: response.status };
  const data = (await response.json()) as {
    html_url: string;
    number: number;
  };
  return { ok: true, htmlUrl: data.html_url, number: data.number };
}

async function launchCursorAgent(input: {
  apiKey: string;
  repo: string;
  prompt: string;
}): Promise<string | undefined> {
  const response = await fetch("https://api.cursor.com/v1/agents", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${input.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: { text: input.prompt },
      name: "Quiz bug report",
      repos: [
        {
          url: `https://github.com/${input.repo}`,
          startingRef: "main",
        },
      ],
      autoCreatePR: true,
    }),
  });
  if (!response.ok) return undefined;
  const data = (await response.json()) as {
    agent?: { url?: string };
    url?: string;
  };
  return data.agent?.url ?? data.url;
}

export async function submitBugReport(
  input: BugReportIssueInput,
  config: BugReportConfig = {},
): Promise<BugReportResult> {
  const repo = repoSlug(config);
  const launchAgent = Boolean(config.githubToken && config.cursorApiKey);
  const issue = formatBugReportIssue(input);
  const body = launchAgent
    ? `${issue.body}\n<!-- agent: api -->\n`
    : issue.body;

  if (!config.githubToken) {
    return {
      ok: true,
      issueUrl: newIssueUrl(repo, issue.title, body, issue.labels),
    };
  }

  const created = await createGitHubIssue({
    token: config.githubToken,
    repo,
    title: issue.title,
    body,
    labels: issue.labels,
  });
  if (!created.ok) {
    return {
      ok: false,
      error: `Could not create GitHub issue (${created.status})`,
    };
  }

  let agentUrl: string | undefined;
  if (config.cursorApiKey) {
    agentUrl = await launchCursorAgent({
      apiKey: config.cursorApiKey,
      repo,
      prompt: agentPrompt({
        happened: input.happened,
        expected: input.expected,
        issueUrl: created.htmlUrl,
        issueNumber: created.number,
        snapshotJson: JSON.stringify(input.snapshot, null, 2),
      }),
    });
  }

  return {
    ok: true,
    issueUrl: created.htmlUrl,
    issueNumber: created.number,
    agentUrl,
  };
}
