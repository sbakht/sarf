import { readFile } from "node:fs/promises";

const eventPath = process.env.GITHUB_EVENT_PATH;
if (!eventPath) {
  console.error("GITHUB_EVENT_PATH is missing");
  process.exit(1);
}

const event = JSON.parse(await readFile(eventPath, "utf8"));
const issue = event.issue;
const repo = process.env.GITHUB_REPOSITORY;
const body = issue?.body ?? "";

if (
  !issue ||
  !repo ||
  !body.includes("<!-- sarf-bug-report -->") ||
  body.includes("<!-- agent: api -->")
) {
  console.log("Skipping: not an unhandled quiz bug report");
  process.exit(0);
}

const issueUrl = issue.html_url;
const issueNumber = issue.number;
const cursorKey = process.env.CURSOR_API_KEY;
const ghToken = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;

async function comment(markdown) {
  if (!ghToken) return;
  await fetch(
    `https://api.github.com/repos/${repo}/issues/${issueNumber}/comments`,
    {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${ghToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ body: markdown }),
    },
  );
}

if (!cursorKey) {
  await comment(
    "No `CURSOR_API_KEY` Actions secret is configured, so an AI agent was not launched. Add that secret to auto-reproduce quiz bug reports, fix them, and open a PR.",
  );
  console.log("CURSOR_API_KEY missing; skipped agent launch");
  process.exit(0);
}

const prompt = `A user filed a quiz bug report. Reproduce it, write a failing test first (TDD), fix it, and open a pull request.

Issue: ${issueUrl}
The PR description must include "Closes #${issueNumber}".

${body}

Follow the repo's TDD rule. Do not change unrelated behavior.`;

const response = await fetch("https://api.cursor.com/v1/agents", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${cursorKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    prompt: { text: prompt },
    name: `Quiz bug #${issueNumber}`,
    repos: [
      {
        url: `https://github.com/${repo}`,
        startingRef: "main",
      },
    ],
    autoCreatePR: true,
  }),
});

if (!response.ok) {
  const detail = await response.text();
  await comment(
    `Could not launch the AI fixer (${response.status}).\n\n\`\`\`\n${detail.slice(0, 1000)}\n\`\`\``,
  );
  console.error(detail);
  process.exit(1);
}

const data = await response.json();
const agentUrl = data.agent?.url ?? data.url;
await comment(
  agentUrl
    ? `An AI agent is reproducing this report and will open a PR if it finds a fix: ${agentUrl}`
    : "An AI agent is reproducing this report and will open a PR if it finds a fix.",
);
console.log(agentUrl ?? "agent launched");
