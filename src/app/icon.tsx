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
          background: "transparent",
        }}
      >
        <svg
          viewBox="0 0 36 36"
          width="32"
          height="32"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Diamond frame */}
          <path
            d="M18 3L33 18L18 33L3 18Z"
            stroke="#dc2626"
            strokeWidth="2"
            fill="none"
          />
          {/* Needle diagonal */}
          <line
            x1="11"
            y1="11"
            x2="25"
            y2="25"
            stroke="#dc2626"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Ink drop tip */}
          <circle cx="25.5" cy="25.5" r="2.5" fill="#dc2626" />
          {/* Corner dots */}
          <circle cx="18" cy="3" r="1.5" fill="#dc2626" />
          <circle cx="33" cy="18" r="1.5" fill="#dc2626" />
          <circle cx="18" cy="33" r="1.5" fill="#dc2626" />
          <circle cx="3" cy="18" r="1.5" fill="#dc2626" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
