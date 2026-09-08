import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COURSE_CHAPTERS, getChapter } from "@/lib/sarf";
import { WeakView } from "../WeakView";

export function generateStaticParams() {
  return COURSE_CHAPTERS.map((chapter) => ({ slug: chapter.id }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const chapter = getChapter(slug);
  if (!chapter) return { title: "Weak verbs" };
  return { title: `${chapter.title} · Weak verbs · Sarf Trainer` };
}

export default async function WeakChapterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!getChapter(slug)) notFound();
  return <WeakView slug={slug} />;
}
