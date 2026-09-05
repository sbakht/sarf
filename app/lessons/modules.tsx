"use client";

import type { ComponentType } from "react";
import { TheRootArticle } from "./articles/TheRoot";
import {
  buildRootGenderSteps,
  conjugateRootGender,
  makeRootGenderPrompt,
  type ConjugateResult,
  type LessonStep,
} from "@/lib/sarf";

export type LessonModule = {
  Article: ComponentType;
  makePrompt: (rng?: () => number) => unknown;
  buildSteps: (prompt: unknown) => LessonStep[];
  toResult: (prompt: unknown) => ConjugateResult;
};

export const LESSON_MODULES: Record<string, LessonModule> = {
  "the-root": {
    Article: TheRootArticle,
    makePrompt: makeRootGenderPrompt,
    buildSteps: (prompt) =>
      buildRootGenderSteps(prompt as Parameters<typeof buildRootGenderSteps>[0]),
    toResult: (prompt) =>
      conjugateRootGender(prompt as Parameters<typeof conjugateRootGender>[0]),
  },
};
