"use client";

import { FORM_BY_ID, type FormId } from "@/lib/sarf";
import { useSettings } from "./SettingsProvider";
import { Badge } from "@/components/ui/badge";

export function FormBadge({ form }: { form: FormId }) {
  const { labelMode } = useSettings();
  const meta = FORM_BY_ID[form];

  const formLabel = (
    <span
      className={labelMode === "wazn" ? "text-muted-foreground" : "font-semibold"}
    >
      Form {meta.roman}
    </span>
  );
  const waznLabel = (
    <span
      dir="rtl"
      className={`font-arabic ${
        labelMode === "form" ? "text-lg text-muted-foreground" : "text-xl"
      }`}
    >
      {meta.waznPast}
    </span>
  );

  return (
    <Badge variant="outline" className="h-auto items-baseline gap-2 py-1">
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
    </Badge>
  );
}
