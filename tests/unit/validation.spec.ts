import { describe, expect, it } from "vitest";
import {
  emailSchema,
  fieldErrors,
  passwordSchema,
  resetPasswordSchema,
  saveAnalysisSchema,
  signupSchema,
} from "@/lib/validation";

const validSignup = {
  name: "Alex Morgan",
  email: "alex@example.com",
  password: "football2026",
  acceptTerms: true,
};

describe("account validation", () => {
  it("accepts a valid signup and normalises the email", () => {
    const result = signupSchema.parse({ ...validSignup, email: "  Alex@EXAMPLE.com " });
    expect(result.email).toBe("alex@example.com");
  });

  it("rejects weak passwords", () => {
    expect(passwordSchema.safeParse("short1").success).toBe(false);
    expect(passwordSchema.safeParse("lettersandnumbers").success).toBe(false);
    expect(passwordSchema.safeParse("abcdefghij").success).toBe(false);
    expect(passwordSchema.safeParse("football2026").success).toBe(true);
  });

  it("requires explicit acceptance of the terms", () => {
    const result = signupSchema.safeParse({ ...validSignup, acceptTerms: false });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(fieldErrors(result.error).acceptTerms).toMatch(/terms/i);
    }
  });

  it("rejects malformed emails", () => {
    expect(emailSchema.safeParse("not-an-email").success).toBe(false);
    expect(emailSchema.safeParse("a@b.co").success).toBe(true);
  });

  it("requires a sufficiently long reset token", () => {
    expect(resetPasswordSchema.safeParse({ token: "short", password: "football2026" }).success).toBe(
      false,
    );
    expect(
      resetPasswordSchema.safeParse({ token: "a".repeat(32), password: "football2026" }).success,
    ).toBe(true);
  });
});

describe("analysis validation", () => {
  const base = {
    competitionId: "premier-league-2025-26",
    homeTeamId: "home",
    awayTeamId: "away",
  };

  it("accepts an empty title and notes", () => {
    expect(saveAnalysisSchema.safeParse(base).success).toBe(true);
  });

  it("caps notes at 500 characters", () => {
    expect(saveAnalysisSchema.safeParse({ ...base, notes: "x".repeat(501) }).success).toBe(false);
    expect(saveAnalysisSchema.safeParse({ ...base, notes: "x".repeat(500) }).success).toBe(true);
  });

  it("returns the first message for each field", () => {
    const result = saveAnalysisSchema.safeParse({ ...base, title: "x".repeat(100) });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(fieldErrors(result.error).title).toBeTruthy();
    }
  });
});
