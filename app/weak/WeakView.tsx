"use client";

import Link from "next/link";
import {
  COURSE_CHAPTERS,
  buildWeakSteps,
  chapterRounds,
  conjugateCourse,
  getChapter,
  makeWeakPrompt,
  nextChapter,
  type ChapterId,
  type WeakPrompt,
} from "@/lib/sarf";
import { useLessonQuiz } from "@/app/lessons/useLessonQuiz";
import { cn } from "@/lib/utils";
import { WEAK_ARTICLES } from "./articles";
import { WeakQuiz } from "./WeakQuiz";

function ChapterSession({ slug }: { slug: ChapterId }) {
  const quiz = useLessonQuiz<WeakPrompt>({
    makePrompt: (rng) => makeWeakPrompt(slug, rng),
    buildSteps: buildWeakSteps,
    toResult: (prompt) => conjugateCourse(prompt),
    rounds: chapterRounds(slug),
  });
  const following = nextChapter(slug);
  return (
    <WeakQuiz
      quiz={quiz}
      next={following ? { slug: following.id, title: following.title } : null}
    />
  );
}

export function WeakView({ slug }: { slug: string }) {
  const chapter = getChapter(slug);
  const Article = WEAK_ARTICLES[slug as ChapterId];
  const index = COURSE_CHAPTERS.findIndex((item) => item.id === slug);

  if (!chapter || !Article) {
    return <p className="text-muted-foreground">This chapter was not found.</p>;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(14rem,18rem)_minmax(0,1fr)]">
      <aside className="flex flex-col gap-3 lg:sticky lg:top-20 lg:self-start">
        <Link
          href="/weak"
          className="text-xs uppercase tracking-wider text-energy hover:underline"
        >
          Weak verbs
        </Link>
        <nav className="flex flex-col gap-2">
          {COURSE_CHAPTERS.map((item, itemIndex) => {
            const active = item.id === slug;
            return (
              <Link
                key={item.id}
                href={`/weak/${item.id}`}
                className={cn(
                  "rounded-xl border px-3 py-3 text-start",
                  active
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:bg-muted/70",
                )}
              >
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {String(itemIndex + 1).padStart(2, "0")}
                </p>
                <p className="mt-1 font-medium leading-5">{item.title}</p>
                <p
                  dir="rtl"
                  className="mt-1 font-arabic text-lg text-muted-foreground"
                >
                  {item.arabic}
                </p>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex flex-col gap-10">
        <Article kicker={`Chapter ${String(index + 1).padStart(2, "0")}`} />
        <ChapterSession key={slug} slug={slug as ChapterId} />
      </div>
    </div>
  );
}
