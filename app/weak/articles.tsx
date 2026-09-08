import type { ComponentType } from "react";
import type { ChapterId } from "@/lib/sarf";
import { AjwafArticle } from "./articles/Ajwaf";
import { ClassifyArticle } from "./articles/Classify";
import { MahmuzArticle } from "./articles/Mahmuz";
import { MasteryArticle } from "./articles/Mastery";
import { MithalArticle } from "./articles/Mithal";
import { MudafArticle } from "./articles/Mudaf";
import { NaqisArticle } from "./articles/Naqis";
import { SoundVsWeakArticle } from "./articles/SoundVsWeak";

export const WEAK_ARTICLES: Record<
  ChapterId,
  ComponentType<{ kicker?: string }>
> = {
  "sound-vs-weak": SoundVsWeakArticle,
  classify: ClassifyArticle,
  mithal: MithalArticle,
  ajwaf: AjwafArticle,
  naqis: NaqisArticle,
  mudaf: MudafArticle,
  mahmuz: MahmuzArticle,
  mastery: MasteryArticle,
};
