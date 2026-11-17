"use client";

import Link from "next/link";
import "./globals.css";

export default function GlobalError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  const digest =
    error instanceof Error && "digest" in error && typeof error.digest === "string"
      ? error.digest
      : null;

  return (
    <html lang="en" data-theme="light">
      <body>
        <title>Something went wrong · VeltrixVault</title>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "32px",
            background: "#f4f0e4",
            color: "#0b1f18",
            fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "520px",
              border: "1px solid #d8d2c1",
              borderRadius: "24px",
              background: "#fbf8ef",
              padding: "36px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                margin: "0 auto",
                borderRadius: 18,
                background: "#0b2e22",
                color: "#c9f26a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                fontWeight: 800,
              }}
            >
              VV
            </div>
            <p
              style={{
                margin: "24px 0 0",
                fontSize: 11,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#5f6f67",
              }}
            >
              Something went wrong
            </p>
            <h1 style={{ margin: "10px 0 0", fontSize: 30, lineHeight: 1.1, letterSpacing: "-0.03em" }}>
              The Vault could not load.
            </h1>
            <p style={{ margin: "12px 0 0", fontSize: 14, lineHeight: 1.6, color: "#5f6f67" }}>
              A problem interrupted the whole page. Retry the request, or return to the homepage. The
              health endpoint at /api/health can confirm whether the service is up.
            </p>
            {digest ? (
              <p
                style={{
                  margin: "14px 0 0",
                  fontSize: 11,
                  color: "#8a938d",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                }}
              >
                Reference: {digest}
              </p>
            ) : null}
            <div
              style={{
                marginTop: 26,
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                justifyContent: "center",
              }}
            >
              <button
                type="button"
                onClick={() => retry()}
                style={{
                  height: 40,
                  padding: "0 20px",
                  borderRadius: 999,
                  border: "none",
                  background: "#0b2e22",
                  color: "#f4f0e4",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Try again
              </button>
              <Link
                href="/"
                style={{
                  height: 40,
                  padding: "0 20px",
                  borderRadius: 999,
                  border: "1px solid #b9b2a0",
                  color: "#0b1f18",
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                Back to the homepage
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
