import { ImageResponse } from "next/og";

export const runtime = "edge";
export const revalidate = 86400;

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
        {/* Background glow — top right */}
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

        {/* Background glow — bottom left */}
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

        {/* Border */}
        <div
          style={{
            position: "absolute",
            top: "24px",
            left: "24px",
            right: "24px",
            bottom: "24px",
            border: "1px solid rgba(20, 184, 166, 0.15)",
            borderRadius: "16px",
            display: "flex",
          }}
        />

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
          {/* IL Logo badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "72px",
              height: "72px",
              borderRadius: "16px",
              background: "#14B8A6",
            }}
          >
            <span
              style={{
                fontSize: "42px",
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "-2px",
                lineHeight: 1,
              }}
            >
              IL
            </span>
          </div>

          {/* Brand name */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              marginTop: "24px",
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

          {/* Divider */}
          <div
            style={{
              width: "80px",
              height: "2px",
              background: "linear-gradient(90deg, transparent, #14B8A6, transparent)",
              marginTop: "32px",
              display: "flex",
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
            <div
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
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#14B8A6", display: "flex" }} />
              <span style={{ fontSize: "16px", color: "#94A3B8", fontFamily: "system-ui, sans-serif" }}>Browse by Style</span>
            </div>
            <div
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
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#14B8A6", display: "flex" }} />
              <span style={{ fontSize: "16px", color: "#94A3B8", fontFamily: "system-ui, sans-serif" }}>Read Reviews</span>
            </div>
            <div
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
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#14B8A6", display: "flex" }} />
              <span style={{ fontSize: "16px", color: "#94A3B8", fontFamily: "system-ui, sans-serif" }}>Nationwide</span>
            </div>
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
            display: "flex",
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
