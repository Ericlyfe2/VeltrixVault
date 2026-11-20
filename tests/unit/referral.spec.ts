import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", () => ({ db: {} }));

const { generateReferralCode, normaliseReferralCode } = await import("@/lib/referral");

describe("referral codes", () => {
  it("generates a readable eight-character code", () => {
    for (let index = 0; index < 12; index += 1) {
      const code = generateReferralCode();
      expect(code).toMatch(/^VV[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/);
    }
  });

  it("normalises lowercase codes with surrounding whitespace", () => {
    expect(normaliseReferralCode("  vvabc123  ")).toBe("VVABC123");
  });

  it("rejects empty, malformed, or oversized codes", () => {
    expect(normaliseReferralCode(null)).toBeNull();
    expect(normaliseReferralCode("")).toBeNull();
    expect(normaliseReferralCode("abc")).toBeNull();
    expect(normaliseReferralCode("VV-ABC-123")).toBeNull();
    expect(normaliseReferralCode("ABCDEFGHIJKLMNOPQ")).toBeNull();
  });
});
