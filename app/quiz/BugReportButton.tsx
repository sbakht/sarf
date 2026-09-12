"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  buildBugReportSnapshot,
  type BugReportQuizState,
  type BugReportSnapshot,
} from "@/lib/bug-report";

export function bugReportSource(
  quiz: Omit<BugReportQuizState, "path">,
  path: string,
): BugReportQuizState {
  return { ...quiz, path };
}

function summary(snapshot: BugReportSnapshot): string {
  const { prompt, surface, current } = snapshot.question;
  const verb = surface ?? prompt?.rootArabic ?? "no verb on screen";
  const question =
    current?.title ?? (snapshot.question.done ? "round complete" : "no step");
  return [
    `Filters: ${snapshot.filters.enabledQuestions.join(", ")} · forms ${snapshot.filters.enabledForms.join(", ")} · ${snapshot.filters.enabledTenses.join(", ")} · ${snapshot.filters.enabledVoices.join(", ")} · ${snapshot.filters.enabledPersons.length} pronouns · ${snapshot.filters.enabledWeaknesses.join(", ")} · letters ${snapshot.filters.enabledWeakLetters.join(", ")}`,
    prompt
      ? `Question: ${verb} · Form ${prompt.form} · ${prompt.tense} · ${prompt.voice} · ${prompt.person} · ${question}`
      : "Question: none",
    snapshot.answers.length === 0
      ? "Answers: none yet"
      : `Answers: ${snapshot.answers
          .map((answer) => `${answer.question}=${answer.selected}`)
          .join("; ")}`,
  ].join("\n");
}

export function BugReportButton({ source }: { source: BugReportQuizState }) {
  const [open, setOpen] = useState(false);
  const [happened, setHappened] = useState("");
  const [expected, setExpected] = useState("");
  const [snapshot, setSnapshot] = useState(() =>
    buildBugReportSnapshot(source),
  );
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [issueUrl, setIssueUrl] = useState<string | null>(null);
  const [agentUrl, setAgentUrl] = useState<string | null>(null);

  function handleOpenChange(next: boolean) {
    if (next) {
      setSnapshot(buildBugReportSnapshot(source));
      setHappened("");
      setExpected("");
      setError(null);
      setIssueUrl(null);
      setAgentUrl(null);
    }
    setOpen(next);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/bug-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          happened,
          expected: expected.trim() || undefined,
          snapshot,
        }),
      });
      const data = (await response.json()) as {
        ok: boolean;
        error?: string;
        issueUrl?: string;
        agentUrl?: string;
      };
      if (!data.ok || !data.issueUrl) {
        setError(data.error ?? "Could not send the bug report");
        return;
      }
      setIssueUrl(data.issueUrl);
      setAgentUrl(data.agentUrl ?? null);
    } catch {
      setError("Could not send the bug report");
    } finally {
      setPending(false);
    }
  }

  const draftLink = issueUrl?.includes("/issues/new");

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Button
        variant="outline"
        size="lg"
        className="h-12 w-full rounded-xl text-base"
        onClick={() => handleOpenChange(true)}
      >
        <Bug data-icon="inline-start" />
        Bug report
      </Button>
      <DialogContent
        data-bug-report
        className="max-h-[90vh] overflow-y-auto sm:max-w-lg"
      >
        <form onSubmit={onSubmit} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Report a quiz bug</DialogTitle>
            <DialogDescription>
              Describe what went wrong. We attach the selected filters, the
              current question, and your answers, then open a GitHub issue. An
              AI will try to reproduce it, fix it, and open a pull request.
            </DialogDescription>
          </DialogHeader>

          {issueUrl ? (
            <div className="grid gap-2 text-sm">
              <p>
                {draftLink
                  ? "Finish sending the report on GitHub."
                  : "GitHub issue opened."}{" "}
                <a
                  href={issueUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-primary underline underline-offset-4"
                >
                  {draftLink ? "Open issue form" : "View issue"}
                </a>
              </p>
              {agentUrl ? (
                <p>
                  An AI agent is reproducing it:{" "}
                  <a
                    href={agentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-primary underline underline-offset-4"
                  >
                    view agent
                  </a>
                </p>
              ) : null}
            </div>
          ) : (
            <>
              <div className="grid gap-2">
                <Label htmlFor="bug-happened">What happened?</Label>
                <Textarea
                  id="bug-happened"
                  required
                  value={happened}
                  onChange={(event) => setHappened(event.target.value)}
                  placeholder="The quiz marked the wrong form for this verb."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bug-expected">What did you expect?</Label>
                <Textarea
                  id="bug-expected"
                  value={expected}
                  onChange={(event) => setExpected(event.target.value)}
                  placeholder="Form I should have been the correct answer."
                />
              </div>
              <div className="grid gap-2">
                <p className="text-sm font-medium">Attached quiz data</p>
                <pre className="max-h-40 overflow-auto rounded-lg bg-muted p-3 text-xs whitespace-pre-wrap">
                  {summary(snapshot)}
                </pre>
              </div>
              {error ? (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              ) : null}
            </>
          )}

          <DialogFooter>
            {issueUrl ? (
              <Button type="button" onClick={() => setOpen(false)}>
                Done
              </Button>
            ) : (
              <Button type="submit" disabled={pending || !happened.trim()}>
                {pending ? "Sending…" : "Send bug report"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
