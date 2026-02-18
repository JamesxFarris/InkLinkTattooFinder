import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#dc2626",
          borderRadius: "36px",
        }}
      >
        <svg
          viewBox="0 0 100 100"
          width="120"
          height="120"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Location pin outline */}
          <path
            d="M50 5C35.6 5 24 16.6 24 31C24 50.4 50 85 50 85S76 50.4 76 31C76 16.6 64.4 5 50 5Z"
            fill="white"
          />
          {/* Ink drop inside */}
          <path
            d="M50 20C50 20 40 31 40 36.5C40 41.5 44.5 45 50 45C55.5 45 60 41.5 60 36.5C60 31 50 20 50 20Z"
            fill="#dc2626"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
