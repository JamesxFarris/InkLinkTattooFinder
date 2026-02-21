/**
 * Color palette for each category — used by CategoryCard
 * for themed icon backgrounds.
 */
export const categoryColors: Record<
  string,
  { from: string; to: string; accent: string }
> = {
  traditional:        { from: "#2b5a8f", to: "#5c2d18", accent: "#e04a3a" },
  "neo-traditional":  { from: "#8a2a42", to: "#4a5c2e", accent: "#c43050" },
  realism:            { from: "#334e6e", to: "#4a3e28", accent: "#e8920e" },
  japanese:           { from: "#3a3580", to: "#5a1a1a", accent: "#ef4444" },
  blackwork:          { from: "#2a2a2a", to: "#3a3a3a", accent: "#6b6b6b" },
  watercolor:         { from: "#5c22a8", to: "#1a6060", accent: "#f472b6" },
  "fine-line":        { from: "#2d4e2d", to: "#4a4038", accent: "#8ab892" },
  tribal:             { from: "#3a3530", to: "#4a4540", accent: "#78716c" },
  geometric:          { from: "#4a3810", to: "#1e2e4e", accent: "#eab308" },
  minimalist:         { from: "#4a4540", to: "#3a3530", accent: "#a8a29e" },
  dotwork:            { from: "#3a3580", to: "#302a6e", accent: "#6366f1" },
  chicano:            { from: "#4a3010", to: "#3a2510", accent: "#eab308" },
  illustrative:       { from: "#0a5550", to: "#4a2810", accent: "#2dd4bf" },
  "script-lettering": { from: "#5c22a8", to: "#351560", accent: "#c084fc" },
  "trash-polka":      { from: "#3a3530", to: "#5a1a1a", accent: "#ef4444" },
  "new-school":       { from: "#4a2810", to: "#3a2510", accent: "#fb923c" },
  surrealism:         { from: "#5c22a8", to: "#4a3810", accent: "#a78bfa" },
  "cover-up":         { from: "#3a3530", to: "#0a5550", accent: "#2dd4bf" },
  portrait:           { from: "#4a3e28", to: "#3a3530", accent: "#fcd34d" },
  biomechanical:      { from: "#1e2e4e", to: "#3a3530", accent: "#60a5fa" },
  "flash-tattoos":    { from: "#4a3810", to: "#4a2810", accent: "#fcd34d" },
  "tattoo-removal":   { from: "#5a1a1a", to: "#3a3530", accent: "#f87171" },
  "piercing-studio":  { from: "#3a3530", to: "#0a5550", accent: "#2dd4bf" },
};

const icons: Record<string, React.ReactNode> = {
  // — Tattoo Styles —

  traditional: (
    // Anchor — cream + red, classic Americana
    <>
      <path d="M12 2a2 2 0 100 4 2 2 0 000-4z" fill="#e8d5b5" stroke="#e8d5b5" strokeWidth="0" />
      <path d="M12 6v14" stroke="#e8d5b5" strokeWidth="2" />
      <path d="M7 20c0-3.5 2-6 5-6s5 2.5 5 6" stroke="#e8d5b5" strokeWidth="2" fill="none" />
      <path d="M5 14l2 2-2 2" stroke="#ff6b5b" strokeWidth="2" fill="none" />
      <path d="M19 14l-2 2 2 2" stroke="#ff6b5b" strokeWidth="2" fill="none" />
      <line x1="8" y1="12" x2="16" y2="12" stroke="#ff6b5b" strokeWidth="2" />
    </>
  ),

  "neo-traditional": (
    // Ornate rose — pink + sage green
    <>
      <path d="M12 6c-2 0-4 2-4 4.5 0 3 2.5 5.5 4 7.5 1.5-2 4-4.5 4-7.5 0-2.5-2-4.5-4-4.5z" fill="#f0a0b0" opacity="0.3" />
      <path d="M12 6c-2 0-4 2-4 4.5 0 3 2.5 5.5 4 7.5 1.5-2 4-4.5 4-7.5 0-2.5-2-4.5-4-4.5z" stroke="#f0a0b0" strokeWidth="1.5" fill="none" />
      <path d="M10 9c1-1 3-1 4 0" stroke="#f0a0b0" strokeWidth="1.5" fill="none" />
      <path d="M9.5 11.5c1.5-.5 3.5-.5 5 0" stroke="#f0a0b0" strokeWidth="1.5" fill="none" />
      <path d="M12 18v3" stroke="#a8c99a" strokeWidth="2" />
      <path d="M9 16c-1 .5-2 0-2.5-1" stroke="#a8c99a" strokeWidth="1.5" fill="none" />
      <path d="M15 16c1 .5 2 0 2.5-1" stroke="#a8c99a" strokeWidth="1.5" fill="none" />
    </>
  ),

  realism: (
    // Camera lens / eye — light slate + amber iris
    <>
      <circle cx="12" cy="12" r="8" stroke="#94a3b8" strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="12" r="5" stroke="#94a3b8" strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="12" r="3" fill="#f59e0b" opacity="0.35" />
      <circle cx="12" cy="12" r="3" stroke="#f59e0b" strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="12" r="1.2" fill="#1e293b" />
      <circle cx="13" cy="11" r="0.6" fill="white" />
    </>
  ),

  japanese: (
    // Koi wave — light indigo + crimson
    <>
      <path d="M3 16c2-2 4-4 6-4s3 1.5 4 1.5 2.5-1 4-2.5" stroke="#a5b4fc" strokeWidth="2" fill="none" />
      <path d="M3 20c2-2 4-4 6-4s3 1.5 4 1.5 2.5-1 4-2.5" stroke="#a5b4fc" strokeWidth="1.5" fill="none" opacity="0.5" />
      <circle cx="16" cy="8" r="4" fill="#f87171" opacity="0.25" />
      <circle cx="16" cy="8" r="4" stroke="#f87171" strokeWidth="1.5" fill="none" />
      <path d="M14 7.5c.5-.5 1.5-1 2.5-.5" stroke="#f87171" strokeWidth="1" fill="none" />
      <circle cx="15" cy="8.5" r="0.5" fill="#f87171" />
    </>
  ),

  blackwork: (
    // Bold geometric fill — white + grey
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" fill="white" opacity="0.08" />
      <rect x="4" y="4" width="16" height="16" rx="2" stroke="#d4d4d4" strokeWidth="1.5" fill="none" />
      <path d="M4 4l16 16" stroke="#e5e5e5" strokeWidth="1.5" />
      <path d="M20 4L4 20" stroke="#e5e5e5" strokeWidth="1.5" />
      <path d="M12 4v16" stroke="#a3a3a3" strokeWidth="1" opacity="0.6" />
      <path d="M4 12h16" stroke="#a3a3a3" strokeWidth="1" opacity="0.6" />
    </>
  ),

  watercolor: (
    // Paint blobs — vibrant purple, teal, pink splashes
    <>
      <circle cx="8" cy="9" r="4.5" fill="#c4b5fd" opacity="0.45" />
      <circle cx="15" cy="8" r="3.5" fill="#5eead4" opacity="0.45" />
      <circle cx="12" cy="14" r="4" fill="#f9a8d4" opacity="0.45" />
      <circle cx="8" cy="9" r="4.5" stroke="#c4b5fd" strokeWidth="1" fill="none" opacity="0.7" />
      <circle cx="15" cy="8" r="3.5" stroke="#5eead4" strokeWidth="1" fill="none" opacity="0.7" />
      <circle cx="12" cy="14" r="4" stroke="#f9a8d4" strokeWidth="1" fill="none" opacity="0.7" />
      <circle cx="17" cy="15" r="2" fill="#fcd34d" opacity="0.4" />
    </>
  ),

  "fine-line": (
    // Delicate botanical — sage green + warm grey
    <>
      <path d="M12 21V8" stroke="#d6d3d1" strokeWidth="1" />
      <path d="M12 14c-3-1-5-4-4-7" stroke="#a8c99a" strokeWidth="1" fill="none" />
      <path d="M12 11c3-1 5-4 4-7" stroke="#a8c99a" strokeWidth="1" fill="none" />
      <path d="M12 17c-2-.5-3.5-2-3-4" stroke="#a8c99a" strokeWidth="1" fill="none" />
      <path d="M12 16c2-.5 3.5-2.5 3-4.5" stroke="#a8c99a" strokeWidth="1" fill="none" />
      <circle cx="12" cy="7" r="1" fill="#a8c99a" opacity="0.6" />
    </>
  ),

  tribal: (
    // Bold tribal swirl — light stone
    <>
      <path d="M6 20c0-5 2-8 6-8" stroke="#d6d3d1" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M12 12c4 0 6-3 6-8" stroke="#d6d3d1" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M12 12c-1 3-1 5 1 7" stroke="#a8a29e" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M15 9c1 0 2-1 2-2" stroke="#a8a29e" strokeWidth="2" fill="none" strokeLinecap="round" />
    </>
  ),

  geometric: (
    // Sacred geometry — gold + soft blue
    <>
      <polygon points="12,3 21,18 3,18" fill="#fcd34d" opacity="0.15" stroke="#fcd34d" strokeWidth="1.5" />
      <polygon points="12,21 3,6 21,6" fill="none" stroke="#93c5fd" strokeWidth="1.5" opacity="0.6" />
      <circle cx="12" cy="12" r="3.5" fill="none" stroke="#fcd34d" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="1" fill="#fcd34d" />
    </>
  ),

  minimalist: (
    // Clean single-stroke shape — warm light grey
    <>
      <circle cx="12" cy="8" r="1" fill="#d6d3d1" />
      <line x1="12" y1="10" x2="12" y2="18" stroke="#d6d3d1" strokeWidth="1.5" />
      <path d="M8 15l4 4 4-4" stroke="#d6d3d1" strokeWidth="1.5" fill="none" />
    </>
  ),

  dotwork: (
    // Stippled mandala — bright indigo dots
    <>
      <circle cx="12" cy="5" r="1.2" fill="#a5b4fc" />
      <circle cx="7" cy="8" r="1.2" fill="#a5b4fc" opacity="0.8" />
      <circle cx="17" cy="8" r="1.2" fill="#a5b4fc" opacity="0.8" />
      <circle cx="5" cy="13" r="1.2" fill="#a5b4fc" opacity="0.6" />
      <circle cx="12" cy="12" r="1.2" fill="#c4b5fd" />
      <circle cx="19" cy="13" r="1.2" fill="#a5b4fc" opacity="0.6" />
      <circle cx="7" cy="17" r="1.2" fill="#a5b4fc" opacity="0.45" />
      <circle cx="12" cy="19" r="1.2" fill="#a5b4fc" opacity="0.45" />
      <circle cx="17" cy="17" r="1.2" fill="#a5b4fc" opacity="0.45" />
    </>
  ),

  chicano: (
    // Praying hands with rays — warm tan + gold
    <>
      <path d="M10 20l1-4c-1.5 0-3-1-3-3V9c0-1 .7-2 2-2" stroke="#d4a843" strokeWidth="1.5" fill="none" />
      <path d="M14 20l-1-4c1.5 0 3-1 3-3V9c0-1-.7-2-2-2" stroke="#d4a843" strokeWidth="1.5" fill="none" />
      <path d="M10 7l2-3 2 3" stroke="#d4a843" strokeWidth="1.5" fill="none" />
      <line x1="12" y1="2" x2="12" y2="3.5" stroke="#fcd34d" strokeWidth="1" opacity="0.8" />
      <line x1="8" y1="3" x2="9" y2="4.5" stroke="#fcd34d" strokeWidth="1" opacity="0.8" />
      <line x1="16" y1="3" x2="15" y2="4.5" stroke="#fcd34d" strokeWidth="1" opacity="0.8" />
    </>
  ),

  illustrative: (
    // Pen nib with ink — bright teal + warm orange
    <>
      <path d="M6 18l2-5L17 4l3 3L11 16l-5 2z" fill="#5eead4" opacity="0.15" />
      <path d="M6 18l2-5L17 4l3 3L11 16l-5 2z" stroke="#5eead4" strokeWidth="1.5" fill="none" />
      <path d="M15.5 5.5l3 3" stroke="#5eead4" strokeWidth="1.5" />
      <circle cx="7.5" cy="16.5" r="1.5" fill="#fb923c" opacity="0.6" />
    </>
  ),

  "script-lettering": (
    // Calligraphy flourish — bright plum
    <>
      <path d="M5 18c1-1 2-2 3-5l2-6c.5-1.5 1-2 2-2s1.5.5 2 2l2 6c1 3 2 4 3 5" stroke="#d8b4fe" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <line x1="8" y1="14" x2="16" y2="14" stroke="#d8b4fe" strokeWidth="1.5" />
      <path d="M4 20c1 0 2-.5 2.5-1.5" stroke="#c084fc" strokeWidth="1" opacity="0.6" fill="none" />
      <path d="M20 20c-1 0-2-.5-2.5-1.5" stroke="#c084fc" strokeWidth="1" opacity="0.6" fill="none" />
    </>
  ),

  "trash-polka": (
    // Bold strokes + red accent — light + crimson
    <>
      <line x1="3" y1="3" x2="21" y2="21" stroke="#e5e5e5" strokeWidth="3" strokeLinecap="round" />
      <line x1="7" y1="2" x2="7" y2="11" stroke="#d4d4d4" strokeWidth="1.5" />
      <line x1="17" y1="13" x2="17" y2="22" stroke="#d4d4d4" strokeWidth="1.5" />
      <circle cx="18" cy="5" r="3.5" fill="#f87171" opacity="0.4" />
      <circle cx="18" cy="5" r="3.5" stroke="#f87171" strokeWidth="1.5" fill="none" />
    </>
  ),

  "new-school": (
    // Cartoon star — bright orange + yellow
    <>
      <path d="M12 2l2.5 6.5L21 10l-5 4.5L17.5 21 12 17.5 6.5 21 8 14.5 3 10l6.5-1.5z" fill="#fb923c" opacity="0.2" />
      <path d="M12 2l2.5 6.5L21 10l-5 4.5L17.5 21 12 17.5 6.5 21 8 14.5 3 10l6.5-1.5z" stroke="#fb923c" strokeWidth="1.5" fill="none" />
      <circle cx="10" cy="11" r="1" fill="#fef3c7" />
      <circle cx="14" cy="11" r="1" fill="#fef3c7" />
      <path d="M10 14c1 1 3 1 4 0" stroke="#fef3c7" strokeWidth="1" fill="none" />
    </>
  ),

  surrealism: (
    // Melting clock — bright purple + amber
    <>
      <ellipse cx="12" cy="9" rx="7" ry="6" fill="#c4b5fd" opacity="0.15" />
      <ellipse cx="12" cy="9" rx="7" ry="6" stroke="#c4b5fd" strokeWidth="1.5" fill="none" />
      <path d="M12 6v3.5l2 1.5" stroke="#c4b5fd" strokeWidth="1.5" fill="none" />
      <path d="M19 11c1.5 3 1 7 0 9" stroke="#fbbf24" strokeWidth="1.5" fill="none" opacity="0.7" />
      <path d="M5 11c-1.5 3-1 7 0 9" stroke="#fbbf24" strokeWidth="1.5" fill="none" opacity="0.7" />
    </>
  ),

  "cover-up": (
    // Overlapping layers — light grey behind, teal in front
    <>
      <rect x="3" y="3" width="11" height="11" rx="2" fill="#d6d3d1" opacity="0.25" stroke="#d6d3d1" strokeWidth="1.5" />
      <line x1="5" y1="5" x2="12" y2="12" stroke="#d6d3d1" strokeWidth="1" opacity="0.5" />
      <rect x="10" y="10" width="11" height="11" rx="2" fill="#5eead4" opacity="0.2" stroke="#5eead4" strokeWidth="1.5" />
    </>
  ),

  portrait: (
    // Face silhouette — warm gold + charcoal
    <>
      <circle cx="12" cy="9" r="5" fill="#fcd34d" opacity="0.18" />
      <circle cx="12" cy="9" r="5" stroke="#d6d3d1" strokeWidth="1.5" fill="none" />
      <path d="M5 21c0-4 3-7 7-7s7 3 7 7" stroke="#d6d3d1" strokeWidth="1.5" fill="none" />
      <circle cx="10" cy="8" r="0.7" fill="#d6d3d1" />
      <circle cx="14" cy="8" r="0.7" fill="#d6d3d1" />
    </>
  ),

  biomechanical: (
    // Gears + circuits — steel grey + electric blue
    <>
      <circle cx="12" cy="12" r="4" fill="#60a5fa" opacity="0.15" />
      <circle cx="12" cy="12" r="4" stroke="#94a3b8" strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="12" r="1.5" fill="#94a3b8" />
      <path d="M12 2v3m0 14v3m10-10h-3M5 12H2" stroke="#94a3b8" strokeWidth="1.5" />
      <path d="M17.07 4.93l-2.12 2.12m-5.9 5.9l-2.12 2.12m12.14 0l-2.12-2.12m-5.9-5.9L6.93 4.93" stroke="#60a5fa" strokeWidth="1" opacity="0.6" />
    </>
  ),

  // — Artist Specializations —

  "flash-tattoos": (
    // Lightning bolt — bright yellow + amber
    <>
      <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" fill="#fcd34d" opacity="0.3" />
      <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" stroke="#fcd34d" strokeWidth="1.5" fill="none" />
    </>
  ),

  // — Service Categories —

  "tattoo-removal": (
    // Laser zap — bright red + light grey
    <>
      <path d="M16 8l-8 8-4-4 8-8z" fill="#f87171" opacity="0.15" />
      <path d="M16 8l-8 8-4-4 8-8z" stroke="#94a3b8" strokeWidth="1.5" fill="none" />
      <path d="M20 4l-5 5" stroke="#f87171" strokeWidth="2" strokeLinecap="round" />
      <line x1="4" y1="20" x2="12" y2="20" stroke="#94a3b8" strokeWidth="1.5" />
    </>
  ),

  "piercing-studio": (
    // Hoop with gem — silver + teal gem
    <>
      <circle cx="12" cy="13" r="7" stroke="#d6d3d1" strokeWidth="1.5" fill="none" />
      <circle cx="17" cy="8" r="2.5" fill="#5eead4" opacity="0.35" />
      <circle cx="17" cy="8" r="2.5" stroke="#5eead4" strokeWidth="1.5" fill="none" />
      <circle cx="17" cy="8" r="0.8" fill="#5eead4" />
    </>
  ),
};

export function CategoryIcon({
  slug,
  className = "h-7 w-7",
}: {
  slug: string;
  className?: string;
}) {
  const icon = icons[slug];

  if (!icon) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        <line x1="5" y1="19" x2="19" y2="5" stroke="#14b8a6" strokeWidth="1.5" />
        <circle cx="19" cy="5" r="2" fill="#14b8a6" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {icon}
    </svg>
  );
}
