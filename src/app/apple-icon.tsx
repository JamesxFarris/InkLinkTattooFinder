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
          background: "#1A1A1A",
          borderRadius: "36px",
        }}
      >
        <svg
          viewBox="0 0 36 36"
          width="120"
          height="120"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Diamond frame */}
          <path
            d="M18 3L33 18L18 33L3 18Z"
            stroke="#C0392B"
            strokeWidth="1.5"
            fill="none"
          />
          {/* Inner diamond */}
          <path
            d="M18 9L27 18L18 27L9 18Z"
            stroke="#C0392B"
            strokeWidth="0.75"
            fill="none"
            opacity="0.4"
          />
          {/* Needle diagonal */}
          <line
            x1="11"
            y1="11"
            x2="25"
            y2="25"
            stroke="#C0392B"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Ink drop tip */}
          <circle cx="25.5" cy="25.5" r="2" fill="#C0392B" />
          {/* Grip lines */}
          <line x1="14" y1="16" x2="16" y2="14" stroke="#C0392B" strokeWidth="0.75" opacity="0.5" />
          <line x1="16" y1="18" x2="18" y2="16" stroke="#C0392B" strokeWidth="0.75" opacity="0.5" />
          <line x1="18" y1="20" x2="20" y2="18" stroke="#C0392B" strokeWidth="0.75" opacity="0.5" />
          {/* Corner dots */}
          <circle cx="18" cy="3" r="1" fill="#C0392B" />
          <circle cx="33" cy="18" r="1" fill="#C0392B" />
          <circle cx="18" cy="33" r="1" fill="#C0392B" />
          <circle cx="3" cy="18" r="1" fill="#C0392B" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
