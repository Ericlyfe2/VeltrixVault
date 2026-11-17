import { randomInt } from "node:crypto";
import { db } from "@/lib/db";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateReferralCode(): string {
  let code = "VV";
  for (let i = 0; i < 6; i += 1) {
    code += ALPHABET[randomInt(0, ALPHABET.length)];
  }
  return code;
}

export function normaliseReferralCode(input: string | null | undefined): string | null {
  if (!input) return null;
  const code = input.trim().toUpperCase();
  if (!/^[A-Z0-9]{4,16}$/.test(code)) return null;
  return code;
}

export async function createUniqueReferralCode(): Promise<string> {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const code = generateReferralCode();
    const existing = await db.user.findUnique({ where: { referralCode: code } });
    if (!existing) return code;
  }
  throw new Error("Could not allocate a referral code. Please retry.");
}
