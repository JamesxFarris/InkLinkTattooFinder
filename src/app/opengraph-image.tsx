import { ImageResponse } from "next/og";

export const alt = "InkLink Tattoo Finder — Find Tattoo Artists & Shops Near You";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0F1117",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Subtle ornamental border */}
        <div
          style={{
            position: "absolute",
            inset: "20px",
            border: "1px solid rgba(20, 184, 166, 0.2)",
            borderRadius: "8px",
          }}
        />

        {/* Logo mark + Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          <svg
            viewBox="0 0 48 48"
            width="80"
            height="80"
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
            {/* Splatter dots */}
            <circle cx="40" cy="11" r="1.2" fill="#14B8A6" opacity="0.5" />
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
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "14px" }}>
              <span style={{ fontSize: "68px", fontWeight: 700, color: "#F1F5F9", letterSpacing: "-0.02em" }}>
                Ink<span style={{ color: "#14B8A6" }}>Link</span>
              </span>
            </div>
            <span style={{ fontSize: "18px", fontWeight: 400, color: "#94A3B8", letterSpacing: "0.2em", textTransform: "uppercase" as const }}>
              Tattoo Finder
            </span>
          </div>
        </div>

        {/* Tagline */}
        <p
          style={{
            marginTop: "36px",
            fontSize: "26px",
            color: "#94A3B8",
            textAlign: "center",
            maxWidth: "600px",
            lineHeight: 1.5,
          }}
        >
          Find the best tattoo artists and shops near you.
          Browse by style, city, and reviews.
        </p>

        {/* Bottom accent line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "#14B8A6",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
