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
          background: "linear-gradient(to bottom, #171717, #0a0a0a)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Icon + Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <svg
            viewBox="0 0 64 64"
            width="80"
            height="80"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M32 2C20.4 2 11 11.4 11 23C11 38.8 32 62 32 62S53 38.8 53 23C53 11.4 43.6 2 32 2Z"
              fill="#dc2626"
            />
            <path
              d="M32 14C32 14 25 22 25 26.4C25 30.2 28.1 33 32 33C35.9 33 39 30.2 39 26.4C39 22 32 14 32 14Z"
              fill="white"
            />
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
              <span style={{ fontSize: "72px", fontWeight: 800, color: "#dc2626" }}>
                InkLink
              </span>
              <span style={{ fontSize: "36px", fontWeight: 500, color: "#a3a3a3" }}>
                Tattoo Finder
              </span>
            </div>
          </div>
        </div>

        {/* Tagline */}
        <p
          style={{
            marginTop: "32px",
            fontSize: "28px",
            color: "#a3a3a3",
            textAlign: "center",
            maxWidth: "700px",
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
            height: "6px",
            background: "#dc2626",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
