"use client";

import { FORM_BY_ID, type FormId } from "@/lib/sarf";
import { useSettings } from "./SettingsProvider";

export function FormBadge({ form }: { form: FormId }) {
  const { labelMode } = useSettings();
  const meta = FORM_BY_ID[form];

  const formLabel = (
    <span className={labelMode === "wazn" ? "text-ink-soft" : "font-semibold"}>
      Form {meta.roman}
    </span>
  );
  const waznLabel = (
    <span
      dir="rtl"
      className={`font-arabic ${
        labelMode === "form" ? "text-lg text-ink-soft" : "text-xl"
      }`}
    >
      {meta.waznPast}
    </span>
  );

  return (
    <span className="inline-flex items-baseline gap-2">
      {labelMode === "wazn" ? (
        <>
          {waznLabel}
          {formLabel}
        </>
      ) : (
        <>
          {formLabel}
          {waznLabel}
        </>
      )}
    </span>
  );
}
