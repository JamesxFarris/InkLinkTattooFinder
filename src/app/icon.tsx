import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
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
          background: "#0F1117",
          borderRadius: "6px",
        }}
      >
        <svg
          viewBox="0 0 48 48"
          width="28"
          height="28"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ink swirl */}
          <path
            d="M38 18c2 6 1 13-4 18s-13 6-19 3"
            stroke="#14B8A6"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M10 30c-2-6-1-13 4-18s13-6 19-3"
            stroke="#14B8A6"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.5"
          />
          {/* Pen body */}
          <rect
            x="17.5"
            y="8"
            width="6"
            height="18"
            rx="1.5"
            transform="rotate(35 20.5 17)"
            fill="#9ca3af"
          />
          {/* Needle */}
          <line
            x1="26"
            y1="28"
            x2="30"
            y2="34"
            stroke="#d1d5db"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Ink drop */}
          <circle cx="31" cy="35.5" r="2.2" fill="#14B8A6" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
