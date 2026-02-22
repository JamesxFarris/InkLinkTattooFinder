import { ImageResponse } from "next/og";

export const runtime = "edge";
export const revalidate = 86400; // cache for 24 hours

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
          background: "linear-gradient(145deg, #0F1117 0%, #1A1D27 40%, #0F1117 100%)",
          fontFamily: "Georgia, serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Large background accent glow — top right */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-80px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(20, 184, 166, 0.12) 0%, transparent 70%)",
          }}
        />

        {/* Secondary glow — bottom left */}
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "-60px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(20, 184, 166, 0.08) 0%, transparent 70%)",
          }}
        />

        {/* Ornamental border with rounded corners */}
        <div
          style={{
            position: "absolute",
            top: "24px",
            left: "24px",
            right: "24px",
            bottom: "24px",
            border: "1px solid rgba(20, 184, 166, 0.15)",
            borderRadius: "16px",
          }}
        />

        {/* Inner ornamental border */}
        <div
          style={{
            position: "absolute",
            top: "32px",
            left: "32px",
            right: "32px",
            bottom: "32px",
            border: "1px solid rgba(255, 255, 255, 0.04)",
            borderRadius: "12px",
          }}
        />

        {/* Decorative corner elements — top left */}
        <svg
          viewBox="0 0 80 80"
          width="80"
          height="80"
          style={{ position: "absolute", top: "16px", left: "16px", opacity: 0.15 }}
        >
          <path d="M0 40 Q0 0 40 0" stroke="#14B8A6" strokeWidth="1.5" fill="none" />
          <path d="M0 24 Q0 0 24 0" stroke="#14B8A6" strokeWidth="1" fill="none" />
          <circle cx="40" cy="0" r="2" fill="#14B8A6" />
          <circle cx="0" cy="40" r="2" fill="#14B8A6" />
        </svg>

        {/* Decorative corner — top right */}
        <svg
          viewBox="0 0 80 80"
          width="80"
          height="80"
          style={{ position: "absolute", top: "16px", right: "16px", opacity: 0.15, transform: "scaleX(-1)" }}
        >
          <path d="M0 40 Q0 0 40 0" stroke="#14B8A6" strokeWidth="1.5" fill="none" />
          <path d="M0 24 Q0 0 24 0" stroke="#14B8A6" strokeWidth="1" fill="none" />
          <circle cx="40" cy="0" r="2" fill="#14B8A6" />
          <circle cx="0" cy="40" r="2" fill="#14B8A6" />
        </svg>

        {/* Decorative corner — bottom left */}
        <svg
          viewBox="0 0 80 80"
          width="80"
          height="80"
          style={{ position: "absolute", bottom: "16px", left: "16px", opacity: 0.15, transform: "scaleY(-1)" }}
        >
          <path d="M0 40 Q0 0 40 0" stroke="#14B8A6" strokeWidth="1.5" fill="none" />
          <path d="M0 24 Q0 0 24 0" stroke="#14B8A6" strokeWidth="1" fill="none" />
          <circle cx="40" cy="0" r="2" fill="#14B8A6" />
          <circle cx="0" cy="40" r="2" fill="#14B8A6" />
        </svg>

        {/* Decorative corner — bottom right */}
        <svg
          viewBox="0 0 80 80"
          width="80"
          height="80"
          style={{ position: "absolute", bottom: "16px", right: "16px", opacity: 0.15, transform: "scale(-1, -1)" }}
        >
          <path d="M0 40 Q0 0 40 0" stroke="#14B8A6" strokeWidth="1.5" fill="none" />
          <path d="M0 24 Q0 0 24 0" stroke="#14B8A6" strokeWidth="1" fill="none" />
          <circle cx="40" cy="0" r="2" fill="#14B8A6" />
          <circle cx="0" cy="40" r="2" fill="#14B8A6" />
        </svg>

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0px",
          }}
        >
          {/* Logo mark */}
          <svg
            viewBox="0 0 48 48"
            width="72"
            height="72"
            xmlns="http://www.w3.org/2000/svg"
          >
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
            <circle cx="40" cy="11" r="1.2" fill="#14B8A6" opacity="0.5" />
            <circle cx="6" cy="37" r="1" fill="#14B8A6" opacity="0.4" />
            <rect
              x="17.5"
              y="8"
              width="6"
              height="18"
              rx="1.5"
              transform="rotate(35 20.5 17)"
              fill="#6b7280"
            />
            <line
              x1="26"
              y1="28"
              x2="30"
              y2="34"
              stroke="#9ca3af"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="31" cy="35.5" r="1.8" fill="#14B8A6" />
          </svg>

          {/* Brand name — large and bold */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              marginTop: "20px",
            }}
          >
            <span
              style={{
                fontSize: "88px",
                fontWeight: 700,
                color: "#F1F5F9",
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              Ink
            </span>
            <span
              style={{
                fontSize: "88px",
                fontWeight: 700,
                color: "#14B8A6",
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              Link
            </span>
          </div>

          {/* Subtitle */}
          <span
            style={{
              fontSize: "20px",
              fontWeight: 400,
              color: "#64748B",
              letterSpacing: "0.35em",
              textTransform: "uppercase" as const,
              marginTop: "8px",
            }}
          >
            Tattoo Finder
          </span>

          {/* Divider line */}
          <div
            style={{
              width: "80px",
              height: "2px",
              background: "linear-gradient(90deg, transparent, #14B8A6, transparent)",
              marginTop: "32px",
            }}
          />

          {/* Tagline */}
          <p
            style={{
              marginTop: "28px",
              fontSize: "28px",
              color: "#CBD5E1",
              textAlign: "center",
              maxWidth: "700px",
              lineHeight: 1.4,
              fontWeight: 400,
            }}
          >
            Find the Best Tattoo Artists & Shops Near You
          </p>

          {/* Feature pills */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "32px",
            }}
          >
            {["Browse by Style", "Read Reviews", "Nationwide"].map((text) => (
              <div
                key={text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 20px",
                  borderRadius: "100px",
                  background: "rgba(20, 184, 166, 0.08)",
                  border: "1px solid rgba(20, 184, 166, 0.2)",
                }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#14B8A6",
                  }}
                />
                <span
                  style={{
                    fontSize: "16px",
                    color: "#94A3B8",
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, transparent, #14B8A6, transparent)",
          }}
        />

        {/* URL at bottom */}
        <span
          style={{
            position: "absolute",
            bottom: "20px",
            fontSize: "14px",
            color: "#475569",
            letterSpacing: "0.1em",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          inklinktattoofinder.com
        </span>
      </div>
    ),
    { ...size }
  );
}
