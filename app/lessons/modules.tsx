"use client";

import type { ComponentType } from "react";
import { TheRootArticle } from "./articles/TheRoot";
import { WhatIsSarfArticle } from "./articles/WhatIsSarf";
import {
  buildIntroSteps,
  buildRootGenderSteps,
  conjugateIntro,
  conjugateRootGender,
  makeIntroPrompt,
  makeRootGenderPrompt,
  type ConjugateResult,
  type IntroPrompt,
  type LessonStep,
  type RootGenderPrompt,
} from "@/lib/sarf";

export type LessonModule = {
  Article: ComponentType;
  makePrompt: (rng?: () => number) => unknown;
  buildSteps: (prompt: unknown) => LessonStep[];
  toResult: (prompt: unknown) => ConjugateResult;
};

export const LESSON_MODULES: Record<string, LessonModule> = {
  "what-is-sarf": {
    Article: WhatIsSarfArticle,
    makePrompt: makeIntroPrompt,
    buildSteps: (prompt) => buildIntroSteps(prompt as IntroPrompt),
    toResult: (prompt) => conjugateIntro(prompt as IntroPrompt),
  },
  "the-root": {
    Article: TheRootArticle,
    makePrompt: makeRootGenderPrompt,
    buildSteps: (prompt) => buildRootGenderSteps(prompt as RootGenderPrompt),
    toResult: (prompt) => conjugateRootGender(prompt as RootGenderPrompt),
  },
};
