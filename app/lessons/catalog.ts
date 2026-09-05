export type LessonMeta = {
  slug: string;
  title: string;
  arabic: string;
  summary: string;
};

export const LESSONS: LessonMeta[] = [
  {
    slug: "the-root",
    title: "The three-letter root",
    arabic: "الجذر الثلاثي",
    summary:
      "Most verbs are built from three root letters. In the past, he and she differ by one ending.",
  },
];

export const FIRST_LESSON_SLUG = LESSONS[0]!.slug;

export function getLesson(slug: string): LessonMeta | undefined {
  return LESSONS.find((lesson) => lesson.slug === slug);
}
