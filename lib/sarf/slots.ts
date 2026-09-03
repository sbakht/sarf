import type { MorphemeSlot, SlotKind } from "./types";
import { isMark } from "./harakat";

export function slot(text: string, kind: SlotKind): MorphemeSlot {
  return { text, kind };
}

export function surfaceOf(slots: MorphemeSlot[]): string {
  return slots.map((item) => item.text).join("");
}

export function consOf(item: MorphemeSlot): string {
  return item.text[0] ?? "";
}

export function marksOf(item: MorphemeSlot): string {
  return item.text.slice(1);
}

export function parseAffix(value: string, kind: SlotKind): MorphemeSlot[] {
  const slots: MorphemeSlot[] = [];
  for (const ch of value) {
    if (isMark(ch)) {
      const last = slots[slots.length - 1];
      if (last) last.text += ch;
      continue;
    }
    slots.push(slot(ch, kind));
  }
  return slots;
}

export function findKind(
  slots: MorphemeSlot[],
  kind: SlotKind,
  from = 0,
): number {
  return slots.findIndex((item, i) => i >= from && item.kind === kind);
}

export function findLastKind(slots: MorphemeSlot[], kind: SlotKind): number {
  for (let i = slots.length - 1; i >= 0; i -= 1) {
    if (slots[i].kind === kind) return i;
  }
  return -1;
}
