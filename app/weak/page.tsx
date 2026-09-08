import Link from "next/link";
import { COURSE_CHAPTERS, FIRST_CHAPTER_ID } from "@/lib/sarf";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function WeakCoursePage() {
  return (
    <div className="flex max-w-2xl flex-col gap-10">
      <section>
        <p className="kicker">Weak verbs</p>
        <h1 className="mt-2 text-4xl font-semibold">From analog to actual</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          This path assumes you already conjugate سالم verbs. Each chapter
          starts from that sound analog, names one mutation family, then drills
          the cells that actually change. Existing lessons, quiz, gym, and lab
          stay as they are — this course lives only here.
        </p>
        <Link
          href={`/weak/${FIRST_CHAPTER_ID}`}
          className={cn(
            buttonVariants({ variant: "energy", size: "lg" }),
            "mt-6 rounded-full",
          )}
        >
          Start chapter 01
        </Link>
      </section>

      <section className="grid gap-4">
        {COURSE_CHAPTERS.map((chapter, index) => (
          <Link key={chapter.id} href={`/weak/${chapter.id}`} className="block">
            <Card className="transition hover:-translate-y-0.5 hover:ring-primary/40">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <p className="kicker">{String(index + 1).padStart(2, "0")}</p>
                  <span className="font-arabic text-2xl text-muted-foreground">
                    {chapter.arabic}
                  </span>
                </div>
                <CardTitle className="mt-2 text-2xl font-semibold">
                  {chapter.title}
                </CardTitle>
                <CardDescription className="leading-7">
                  {chapter.summary}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}
