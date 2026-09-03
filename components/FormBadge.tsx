"use client";

import { FORM_BY_ID, type FormId } from "@/lib/sarf";
import { useSettings } from "./SettingsProvider";

export function FormBadge({ form }: { form: FormId }) {
  const { labelMode } = useSettings();
  const meta = FORM_BY_ID[form];
  return (
    <span className="inline-flex items-baseline gap-2">
      {labelMode === "form" ? (
        <>
          <span className="font-semibold">Form {meta.roman}</span>
          <span dir="rtl" className="font-arabic text-lg text-ink-soft">
            {meta.waznPast}
          </span>
        </>
      ) : (
        <>
          <span dir="rtl" className="font-arabic text-xl">
            {meta.waznPast}
          </span>
          <span className="text-ink-soft">Form {meta.roman}</span>
        </>
      )}
    </span>
  );
}
