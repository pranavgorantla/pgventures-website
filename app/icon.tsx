import { ImageResponse } from "next/og";

export const runtime = "edge";
export const sizes = [
  { size: { width: 32, height: 32 }, contentType: "image/png" },
];
export const contentType = "image/png";

export default function Icon({ size }: { size: { width: number; height: number } }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          borderRadius: "6px",
        }}
      >
        {/* PG monogram */}
        <div
          style={{
            display: "flex",
            fontFamily: "system-ui, sans-serif",
            fontSize: size.width * 0.55,
            fontWeight: "700",
            color: "#fafafa",
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          PG
        </div>
      </div>
    ),
    { ...size }
  );
}
