"use client";

import Image from "next/image";
import { useState } from "react";

type StockImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
};

export function StockImage({
  src,
  alt,
  fill,
  width,
  height,
  className,
  priority,
}: StockImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={`bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950 ${className || ""}`}
        style={fill ? { position: "absolute", inset: 0 } : { width, height }}
        role="img"
        aria-label={alt}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      className={className}
      priority={priority}
      onError={() => setError(true)}
      sizes={fill ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" : undefined}
    />
  );
}
