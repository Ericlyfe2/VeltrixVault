import { describe, expect, it } from "vitest";
import {
  hashIp,
  hashPassword,
  randomToken,
  sha256,
  verifyPassword,
} from "@/lib/auth/password";

describe("password hashing", () => {
  it("verifies a correct password and rejects a wrong one", async () => {
    const hash = await hashPassword("football2026");

    expect(hash).toMatch(/^scrypt\$16384\$8\$1\$/);
    expect(await verifyPassword("football2026", hash)).toBe(true);
    expect(await verifyPassword("football2027", hash)).toBe(false);
  });

  it("rejects malformed stored hashes", async () => {
    expect(await verifyPassword("football2026", "not-a-hash")).toBe(false);
    expect(await verifyPassword("football2026", "scrypt$1$1$1$abc$deadbeef")).toBe(false);
  });
});

describe("tokens and hashing helpers", () => {
  it("creates distinct URL-safe tokens", () => {
    const first = randomToken();
    const second = randomToken();

    expect(first).not.toBe(second);
    expect(first).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(first.length).toBeGreaterThan(40);
  });

  it("produces stable digests", () => {
    expect(sha256("veltrix")).toBe(sha256("veltrix"));
    expect(sha256("veltrix")).not.toBe(sha256("vault"));
  });

  it("hashes IPs with a secret", () => {
    const a = hashIp("127.0.0.1", "secret-a");
    const b = hashIp("127.0.0.1", "secret-b");

    expect(a).toHaveLength(32);
    expect(a).not.toBe(b);
    expect(hashIp("127.0.0.1", "secret-a")).toBe(a);
  });
});
