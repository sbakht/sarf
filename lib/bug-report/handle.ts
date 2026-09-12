import {
  submitBugReport,
  type BugReportConfig,
  type BugReportResult,
} from "./submit";
import type { BugReportSnapshot } from "./snapshot";

export function bugReportConfigFromEnv(
  env: Record<string, string | undefined> = process.env,
): BugReportConfig {
  return {
    githubToken: env.BUG_REPORT_GITHUB_TOKEN || env.GITHUB_TOKEN,
    githubRepo: env.BUG_REPORT_GITHUB_REPO || env.GITHUB_REPO,
    cursorApiKey: env.CURSOR_API_KEY,
  };
}

function isSnapshot(value: unknown): value is BugReportSnapshot {
  if (!value || typeof value !== "object") return false;
  const snapshot = value as Partial<BugReportSnapshot>;
  return (
    typeof snapshot.filters === "object" &&
    snapshot.filters !== null &&
    typeof snapshot.question === "object" &&
    snapshot.question !== null &&
    Array.isArray(snapshot.answers)
  );
}

export async function handleBugReportRequest(
  request: Request,
  config: BugReportConfig = bugReportConfigFromEnv(),
): Promise<Response> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json(
      { ok: false, error: "Quiz snapshot is required" },
      { status: 400 },
    );
  }

  const body = payload as {
    happened?: unknown;
    expected?: unknown;
    snapshot?: unknown;
  };
  if (!isSnapshot(body.snapshot)) {
    return Response.json(
      { ok: false, error: "Quiz snapshot is required" },
      { status: 400 },
    );
  }

  const result: BugReportResult = await submitBugReport(
    {
      happened: typeof body.happened === "string" ? body.happened : "",
      expected: typeof body.expected === "string" ? body.expected : undefined,
      snapshot: body.snapshot,
    },
    config,
  );

  if (!result.ok) {
    return Response.json(result, { status: 502 });
  }
  return Response.json(result);
}
