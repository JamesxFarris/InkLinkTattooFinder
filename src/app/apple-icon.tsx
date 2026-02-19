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
          background: "#0F1117",
          borderRadius: "36px",
        }}
      >
        <svg
          viewBox="0 0 48 48"
          width="130"
          height="130"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ink swirl */}
          <path
            d="M38 18c2 6 1 13-4 18s-13 6-19 3"
            stroke="#14B8A6"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M10 30c-2-6-1-13 4-18s13-6 19-3"
            stroke="#14B8A6"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />
          {/* Splash accents */}
          <path
            d="M37 14c1-2 3-3 4-2"
            stroke="#14B8A6"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.5"
          />
          <path
            d="M8 35c-1 1-2 3-1 4"
            stroke="#14B8A6"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.4"
          />
          {/* Splatter dots */}
          <circle cx="40" cy="11" r="1.2" fill="#14B8A6" opacity="0.5" />
          <circle cx="42" cy="15" r="0.8" fill="#14B8A6" opacity="0.4" />
          <circle cx="6" cy="37" r="1" fill="#14B8A6" opacity="0.4" />
          {/* Pen body */}
          <rect
            x="17.5"
            y="8"
            width="6"
            height="18"
            rx="1.5"
            transform="rotate(35 20.5 17)"
            fill="#6b7280"
          />
          {/* Grip bands */}
          <line x1="18" y1="18" x2="22" y2="15" stroke="#9ca3af" strokeWidth="0.8" opacity="0.6" />
          <line x1="19" y1="20" x2="23" y2="17" stroke="#9ca3af" strokeWidth="0.8" opacity="0.6" />
          <line x1="20" y1="22" x2="24" y2="19" stroke="#9ca3af" strokeWidth="0.8" opacity="0.6" />
          {/* Needle */}
          <line
            x1="26"
            y1="28"
            x2="30"
            y2="34"
            stroke="#9ca3af"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Ink drop */}
          <circle cx="31" cy="35.5" r="1.8" fill="#14B8A6" />
          {/* Pen top */}
          <circle cx="14.5" cy="11" r="0.8" fill="#9ca3af" />
          <circle cx="16" cy="9.5" r="0.8" fill="#9ca3af" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
