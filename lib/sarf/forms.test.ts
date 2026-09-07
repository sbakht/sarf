import { describe, expect, it } from "vitest";
import { FORMS } from "./forms";

describe("form labels", () => {
  it("names Form I المجرد, not الجرّد", () => {
    expect(FORMS[0]?.traditional).toBe("المجرد");
  });
});
