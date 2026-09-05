import { redirect } from "next/navigation";
import { FIRST_LESSON_SLUG } from "./catalog";

export default function LessonsPage() {
  redirect(`/lessons/${FIRST_LESSON_SLUG}`);
}
