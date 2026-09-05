import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLesson, LESSONS } from "../catalog";
import { LessonView } from "../LessonView";

export function generateStaticParams() {
  return LESSONS.map((lesson) => ({ slug: lesson.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) return { title: "Lesson" };
  return { title: `${lesson.title} · Sarf Trainer` };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!getLesson(slug)) notFound();
  return <LessonView slug={slug} />;
}
