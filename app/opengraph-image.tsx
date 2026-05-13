import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "PG Ventures — Building and Delivering Intelligent Systems";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          padding: "72px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Top: Logo area */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "3px",
              height: "20px",
              background: "#fafafa",
              borderRadius: "2px",
            }}
          />
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#a3a3a3",
            }}
          >
            PG Ventures
          </span>
        </div>

        {/* Center: Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", gap: "12px" }}>
            <span style={{ color: "#fafafa", fontSize: "72px", fontWeight: "700", letterSpacing: "-0.03em", lineHeight: 1 }}>
              Build.
            </span>
            <span style={{ color: "#fafafa", fontSize: "72px", fontWeight: "700", letterSpacing: "-0.03em", lineHeight: 1 }}>
              Deliver.
            </span>
            <span style={{ color: "#fafafa", fontSize: "72px", fontWeight: "700", letterSpacing: "-0.03em", lineHeight: 1 }}>
              Scale.
            </span>
          </div>
          <span style={{ color: "#737373", fontSize: "24px", fontWeight: "400", letterSpacing: "-0.01em" }}>
            Two specialized arms. One integrated approach.
          </span>
        </div>

        {/* Bottom: Division tags */}
        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", border: "1px solid #262626", borderRadius: "6px" }}>
            <div style={{ width: "6px", height: "6px", background: "#3b82f6", borderRadius: "50%" }} />
            <span style={{ color: "#a3a3a3", fontSize: "14px" }}>PG Technologies</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", border: "1px solid #262626", borderRadius: "6px" }}>
            <div style={{ width: "6px", height: "6px", background: "#10b981", borderRadius: "50%" }} />
            <span style={{ color: "#a3a3a3", fontSize: "14px" }}>PG Consulting</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
