import { ImageResponse } from "next/og";

export const alt = "Ebi, full-stack developer and automation engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f4f3ee",
          color: "#111111",
          padding: "64px",
          border: "24px solid #111111",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "monospace",
            fontSize: 24,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          <span style={{ background: "#111111", color: "#f4f3ee", padding: "10px 16px" }}>
            0xK4M1 / Lagos, NG
          </span>
          <span>Full-stack / Backend / Bots</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 150, fontWeight: 700, lineHeight: 0.85, letterSpacing: -6 }}>
            EWORITSE
          </span>
          <span
            style={{
              fontSize: 150,
              fontWeight: 700,
              lineHeight: 0.85,
              letterSpacing: -6,
              color: "#ff3b00",
              marginLeft: 90,
            }}
          >
            EGBEJULE
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "8px solid #111111",
            paddingTop: 20,
            fontFamily: "monospace",
            fontSize: 24,
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          <span>Python / FastAPI / Node.js / React</span>
          <span>Backend first. Then the interface.</span>
        </div>
      </div>
    ),
    size,
  );
}
