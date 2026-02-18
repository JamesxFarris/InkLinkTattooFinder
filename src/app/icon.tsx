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
          viewBox="0 0 32 32"
          width="32"
          height="32"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Location pin body */}
          <path
            d="M16 1C10.2 1 5.5 5.7 5.5 11.5C5.5 19.4 16 31 16 31S26.5 19.4 26.5 11.5C26.5 5.7 21.8 1 16 1Z"
            fill="#dc2626"
          />
          {/* Ink drop shape inside the pin */}
          <path
            d="M16 7C16 7 12.5 11 12.5 13.2C12.5 15.1 14.1 16.5 16 16.5C17.9 16.5 19.5 15.1 19.5 13.2C19.5 11 16 7 16 7Z"
            fill="white"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
