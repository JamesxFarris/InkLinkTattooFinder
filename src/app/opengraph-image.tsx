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
          background: "#1c1917",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Subtle ornamental border */}
        <div
          style={{
            position: "absolute",
            inset: "20px",
            border: "1px solid rgba(220, 38, 38, 0.2)",
            borderRadius: "8px",
          }}
        />

        {/* Logo mark + Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          <svg
            viewBox="0 0 36 36"
            width="72"
            height="72"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 3L33 18L18 33L3 18Z"
              stroke="#dc2626"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M18 9L27 18L18 27L9 18Z"
              stroke="#dc2626"
              strokeWidth="0.75"
              fill="none"
              opacity="0.4"
            />
            <line
              x1="11"
              y1="11"
              x2="25"
              y2="25"
              stroke="#dc2626"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="25.5" cy="25.5" r="2" fill="#dc2626" />
            <circle cx="18" cy="3" r="1" fill="#dc2626" />
            <circle cx="33" cy="18" r="1" fill="#dc2626" />
            <circle cx="18" cy="33" r="1" fill="#dc2626" />
            <circle cx="3" cy="18" r="1" fill="#dc2626" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "14px" }}>
              <span style={{ fontSize: "68px", fontWeight: 700, color: "#fafaf9", letterSpacing: "-0.02em" }}>
                Ink<span style={{ color: "#dc2626" }}>Link</span>
              </span>
            </div>
            <span style={{ fontSize: "18px", fontWeight: 400, color: "#78716c", letterSpacing: "0.2em", textTransform: "uppercase" as const }}>
              Tattoo Finder
            </span>
          </div>
        </div>

        {/* Tagline */}
        <p
          style={{
            marginTop: "36px",
            fontSize: "26px",
            color: "#a8a29e",
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
            background: "#dc2626",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
