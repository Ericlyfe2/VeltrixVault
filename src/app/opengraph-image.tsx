import { ImageResponse } from "next/og";

export const alt = "VeltrixVault — football analytics with an inspectable model";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const cream = "#f4f0e4";
const ink = "#0b1f18";
const green = "#0b2e22";
const lime = "#c9f26a";
const gold = "#e8c56b";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: green,
          padding: "64px 72px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -140,
            top: -140,
            width: 520,
            height: 520,
            borderRadius: 520,
            backgroundColor: "#123d2f",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              backgroundColor: lime,
              color: green,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: -2,
            }}
          >
            VV
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ color: cream, fontSize: 30, fontWeight: 700, letterSpacing: -1 }}>
              VeltrixVault
            </div>
            <div style={{ color: lime, fontSize: 17, letterSpacing: 4, textTransform: "uppercase" }}>
              Football analytics, explained
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 900 }}>
          <div
            style={{
              color: cream,
              fontSize: 66,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -2.5,
            }}
          >
            Public data. A transparent model. Your saved work.
          </div>
          <div style={{ color: "#b9c9c0", fontSize: 27, marginTop: 24, lineHeight: 1.4 }}>
            League tables, team records, and an independent-Poisson Match Lab. No tips, no
            guarantees.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {["League explorer", "Match Lab", "How the model works"].map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                border: `1px solid ${gold}55`,
                backgroundColor: "#ffffff10",
                color: cream,
                borderRadius: 999,
                padding: "10px 20px",
                fontSize: 19,
              }}
            >
              {label}
            </div>
          ))}
          <div
            style={{
              display: "flex",
              marginLeft: "auto",
              color: ink,
              backgroundColor: gold,
              borderRadius: 999,
              padding: "10px 20px",
              fontSize: 19,
              fontWeight: 700,
            }}
          >
            Free account
          </div>
        </div>
      </div>
    ),
    size,
  );
}
