import { ModeCard } from "@/components/ModeCard";

const MODES = [
  {
    href: "/lessons",
    kicker: "01 · Start",
    title: "Lessons",
    arabic: "الدروس",
    body: "Short articles for a first look at sarf. Each one teaches one idea, then quizzes it.",
  },
  {
    href: "/atlas",
    kicker: "02 · Map",
    title: "Form Atlas",
    arabic: "الأوزان",
    body: "See Forms I–X as color-coded ف ع ل templates, with both Form numbers and traditional awzan. Form I splits into the six abwab.",
  },
  {
    href: "/gym",
    kicker: "03 · Produce",
    title: "Conjugation Gym",
    arabic: "التصريف",
    body: "Fill the 14-person table from a root and a form. Study the overlay, then quiz empty cells.",
  },
  {
    href: "/quiz",
    kicker: "04 · Recognize",
    title: "Quiz",
    arabic: "التمييز",
    body: "A vocalized verb appears. Name the root, form, tense, voice, and person. Misses reveal the color mapping.",
  },
  {
    href: "/lab",
    kicker: "05 · Exceptions",
    title: "Weak Verb Lab",
    arabic: "المعتل",
    body: "Compare the sound analog with what actually surfaces for أجوف, مثال, ناقص, مضاعف, and مهموز.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-10">
      <section className="max-w-2xl">
        <p className="kicker">Train the pattern</p>
        <h1 className="mt-2 font-arabic text-5xl leading-tight text-foreground">
          تدريب الصرف
        </h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          Learn to see the pattern inside the verb. Extra letters stay indigo,
          root letters stay teal / amber / rose, and person affixes stay stone —
          the same colors in every mode.
        </p>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        {MODES.map((mode) => (
          <ModeCard key={mode.href} {...mode} />
        ))}
      </section>
    </div>
  );
}
