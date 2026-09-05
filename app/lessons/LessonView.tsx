"use client";

import Link from "next/link";
import { LESSONS } from "./catalog";
import { LessonQuiz } from "./LessonQuiz";
import { LESSON_MODULES, type LessonModule } from "./modules";
import { useLessonQuiz } from "./useLessonQuiz";
import { cn } from "@/lib/utils";

function LessonSession({
  mod,
  nextLesson,
}: {
  mod: LessonModule;
  nextLesson?: { slug: string; title: string } | null;
}) {
  const quiz = useLessonQuiz(mod);
  return <LessonQuiz quiz={quiz} nextLesson={nextLesson} />;
}

export function LessonView({ slug }: { slug: string }) {
  const lessonIndex = LESSONS.findIndex((item) => item.slug === slug);
  const lesson = lessonIndex >= 0 ? LESSONS[lessonIndex] : undefined;
  const mod = LESSON_MODULES[slug];
  const next = lessonIndex >= 0 ? LESSONS[lessonIndex + 1] : undefined;

  if (!lesson || !mod) {
    return <p className="text-muted-foreground">This lesson was not found.</p>;
  }

  const Article = mod.Article;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(14rem,18rem)_minmax(0,1fr)]">
      <aside className="flex flex-col gap-3 lg:sticky lg:top-20 lg:self-start">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          Lessons
        </p>
        <nav className="flex flex-col gap-2">
          {LESSONS.map((item, index) => {
            const active = item.slug === slug;
            return (
              <Link
                key={item.slug}
                href={`/lessons/${item.slug}`}
                className={cn(
                  "rounded-xl border px-3 py-3 text-start",
                  active
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:bg-muted/70",
                )}
              >
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
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
        <Article />
        <LessonSession
          key={slug}
          mod={mod}
          nextLesson={next ? { slug: next.slug, title: next.title } : null}
        />
      </div>
    </div>
  );
}
