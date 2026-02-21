import { ImageResponse } from "next/og";

export const size = { width: 48, height: 48 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#14B8A6",
          borderRadius: "10px",
        }}
      >
        <span
          style={{
            fontSize: "28px",
            fontWeight: 800,
            color: "#FFFFFF",
            letterSpacing: "-1px",
            lineHeight: 1,
          }}
        >
          IL
        </span>
      </div>
    ),
    { ...size }
  );
}
