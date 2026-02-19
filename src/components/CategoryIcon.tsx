const icons: Record<string, React.ReactNode> = {
  // — Tattoo Styles —

  traditional: (
    // Anchor — navy + red, classic Americana
    <>
      <path d="M12 2a2 2 0 100 4 2 2 0 000-4z" fill="#1e3a5f" stroke="#1e3a5f" strokeWidth="0" />
      <path d="M12 6v14" stroke="#1e3a5f" strokeWidth="2" />
      <path d="M7 20c0-3.5 2-6 5-6s5 2.5 5 6" stroke="#1e3a5f" strokeWidth="2" fill="none" />
      <path d="M5 14l2 2-2 2" stroke="#c0392b" strokeWidth="2" fill="none" />
      <path d="M19 14l-2 2 2 2" stroke="#c0392b" strokeWidth="2" fill="none" />
      <line x1="8" y1="12" x2="16" y2="12" stroke="#c0392b" strokeWidth="2" />
    </>
  ),

  "neo-traditional": (
    // Ornate rose — deep magenta + olive green
    <>
      <path d="M12 6c-2 0-4 2-4 4.5 0 3 2.5 5.5 4 7.5 1.5-2 4-4.5 4-7.5 0-2.5-2-4.5-4-4.5z" fill="#9b2335" opacity="0.2" />
      <path d="M12 6c-2 0-4 2-4 4.5 0 3 2.5 5.5 4 7.5 1.5-2 4-4.5 4-7.5 0-2.5-2-4.5-4-4.5z" stroke="#9b2335" strokeWidth="1.5" fill="none" />
      <path d="M10 9c1-1 3-1 4 0" stroke="#9b2335" strokeWidth="1.5" fill="none" />
      <path d="M9.5 11.5c1.5-.5 3.5-.5 5 0" stroke="#9b2335" strokeWidth="1.5" fill="none" />
      <path d="M12 18v3" stroke="#5a7247" strokeWidth="2" />
      <path d="M9 16c-1 .5-2 0-2.5-1" stroke="#5a7247" strokeWidth="1.5" fill="none" />
      <path d="M15 16c1 .5 2 0 2.5-1" stroke="#5a7247" strokeWidth="1.5" fill="none" />
    </>
  ),

  realism: (
    // Camera lens / eye — slate blue + amber iris
    <>
      <circle cx="12" cy="12" r="8" stroke="#475569" strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="12" r="5" stroke="#475569" strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="12" r="3" fill="#d97706" opacity="0.25" />
      <circle cx="12" cy="12" r="3" stroke="#d97706" strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="12" r="1.2" fill="#1e293b" />
      <circle cx="13" cy="11" r="0.6" fill="white" />
    </>
  ),

  japanese: (
    // Koi wave — indigo + crimson
    <>
      <path d="M3 16c2-2 4-4 6-4s3 1.5 4 1.5 2.5-1 4-2.5" stroke="#312e81" strokeWidth="2" fill="none" />
      <path d="M3 20c2-2 4-4 6-4s3 1.5 4 1.5 2.5-1 4-2.5" stroke="#312e81" strokeWidth="1.5" fill="none" opacity="0.4" />
      <circle cx="16" cy="8" r="4" fill="#dc2626" opacity="0.15" />
      <circle cx="16" cy="8" r="4" stroke="#dc2626" strokeWidth="1.5" fill="none" />
      <path d="M14 7.5c.5-.5 1.5-1 2.5-.5" stroke="#dc2626" strokeWidth="1" fill="none" />
      <circle cx="15" cy="8.5" r="0.5" fill="#dc2626" />
    </>
  ),

  blackwork: (
    // Bold geometric fill — pure black + grey
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" fill="#171717" opacity="0.15" />
      <rect x="4" y="4" width="16" height="16" rx="2" stroke="#171717" strokeWidth="1.5" fill="none" />
      <path d="M4 4l16 16" stroke="#171717" strokeWidth="1.5" />
      <path d="M20 4L4 20" stroke="#171717" strokeWidth="1.5" />
      <path d="M12 4v16" stroke="#404040" strokeWidth="1" opacity="0.5" />
      <path d="M4 12h16" stroke="#404040" strokeWidth="1" opacity="0.5" />
    </>
  ),

  watercolor: (
    // Paint blobs — purple, teal, pink splashes
    <>
      <circle cx="8" cy="9" r="4.5" fill="#8b5cf6" opacity="0.3" />
      <circle cx="15" cy="8" r="3.5" fill="#14b8a6" opacity="0.3" />
      <circle cx="12" cy="14" r="4" fill="#ec4899" opacity="0.3" />
      <circle cx="8" cy="9" r="4.5" stroke="#8b5cf6" strokeWidth="1" fill="none" opacity="0.6" />
      <circle cx="15" cy="8" r="3.5" stroke="#14b8a6" strokeWidth="1" fill="none" opacity="0.6" />
      <circle cx="12" cy="14" r="4" stroke="#ec4899" strokeWidth="1" fill="none" opacity="0.6" />
      <circle cx="17" cy="15" r="2" fill="#f59e0b" opacity="0.25" />
    </>
  ),

  "fine-line": (
    // Delicate botanical — soft sage green + warm grey
    <>
      <path d="M12 21V8" stroke="#78716c" strokeWidth="1" />
      <path d="M12 14c-3-1-5-4-4-7" stroke="#6b8f71" strokeWidth="1" fill="none" />
      <path d="M12 11c3-1 5-4 4-7" stroke="#6b8f71" strokeWidth="1" fill="none" />
      <path d="M12 17c-2-.5-3.5-2-3-4" stroke="#6b8f71" strokeWidth="1" fill="none" />
      <path d="M12 16c2-.5 3.5-2.5 3-4.5" stroke="#6b8f71" strokeWidth="1" fill="none" />
      <circle cx="12" cy="7" r="1" fill="#6b8f71" opacity="0.4" />
    </>
  ),

  tribal: (
    // Bold tribal swirl — deep charcoal
    <>
      <path d="M6 20c0-5 2-8 6-8" stroke="#292524" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M12 12c4 0 6-3 6-8" stroke="#292524" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M12 12c-1 3-1 5 1 7" stroke="#292524" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M15 9c1 0 2-1 2-2" stroke="#292524" strokeWidth="2" fill="none" strokeLinecap="round" />
    </>
  ),

  geometric: (
    // Sacred geometry — gold + muted blue
    <>
      <polygon points="12,3 21,18 3,18" fill="#d97706" opacity="0.08" stroke="#d97706" strokeWidth="1.5" />
      <polygon points="12,21 3,6 21,6" fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity="0.5" />
      <circle cx="12" cy="12" r="3.5" fill="none" stroke="#d97706" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="1" fill="#d97706" />
    </>
  ),

  minimalist: (
    // Clean single-stroke shape — warm grey
    <>
      <circle cx="12" cy="8" r="1" fill="#78716c" />
      <line x1="12" y1="10" x2="12" y2="18" stroke="#78716c" strokeWidth="1.5" />
      <path d="M8 15l4 4 4-4" stroke="#78716c" strokeWidth="1.5" fill="none" />
    </>
  ),

  dotwork: (
    // Stippled mandala — indigo dots
    <>
      <circle cx="12" cy="5" r="1.2" fill="#4338ca" />
      <circle cx="7" cy="8" r="1.2" fill="#4338ca" opacity="0.7" />
      <circle cx="17" cy="8" r="1.2" fill="#4338ca" opacity="0.7" />
      <circle cx="5" cy="13" r="1.2" fill="#4338ca" opacity="0.5" />
      <circle cx="12" cy="12" r="1.2" fill="#4338ca" />
      <circle cx="19" cy="13" r="1.2" fill="#4338ca" opacity="0.5" />
      <circle cx="7" cy="17" r="1.2" fill="#4338ca" opacity="0.35" />
      <circle cx="12" cy="19" r="1.2" fill="#4338ca" opacity="0.35" />
      <circle cx="17" cy="17" r="1.2" fill="#4338ca" opacity="0.35" />
    </>
  ),

  chicano: (
    // Praying hands with rays — warm brown + gold
    <>
      <path d="M10 20l1-4c-1.5 0-3-1-3-3V9c0-1 .7-2 2-2" stroke="#78350f" strokeWidth="1.5" fill="none" />
      <path d="M14 20l-1-4c1.5 0 3-1 3-3V9c0-1-.7-2-2-2" stroke="#78350f" strokeWidth="1.5" fill="none" />
      <path d="M10 7l2-3 2 3" stroke="#78350f" strokeWidth="1.5" fill="none" />
      <line x1="12" y1="2" x2="12" y2="3.5" stroke="#d97706" strokeWidth="1" opacity="0.6" />
      <line x1="8" y1="3" x2="9" y2="4.5" stroke="#d97706" strokeWidth="1" opacity="0.6" />
      <line x1="16" y1="3" x2="15" y2="4.5" stroke="#d97706" strokeWidth="1" opacity="0.6" />
    </>
  ),

  illustrative: (
    // Pen nib with ink — teal + warm orange
    <>
      <path d="M6 18l2-5L17 4l3 3L11 16l-5 2z" fill="#14b8a6" opacity="0.1" />
      <path d="M6 18l2-5L17 4l3 3L11 16l-5 2z" stroke="#14b8a6" strokeWidth="1.5" fill="none" />
      <path d="M15.5 5.5l3 3" stroke="#14b8a6" strokeWidth="1.5" />
      <circle cx="7.5" cy="16.5" r="1.5" fill="#f97316" opacity="0.4" />
    </>
  ),

  "script-lettering": (
    // Calligraphy flourish — deep plum
    <>
      <path d="M5 18c1-1 2-2 3-5l2-6c.5-1.5 1-2 2-2s1.5.5 2 2l2 6c1 3 2 4 3 5" stroke="#7e22ce" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <line x1="8" y1="14" x2="16" y2="14" stroke="#7e22ce" strokeWidth="1.5" />
      <path d="M4 20c1 0 2-.5 2.5-1.5" stroke="#a855f7" strokeWidth="1" opacity="0.5" fill="none" />
      <path d="M20 20c-1 0-2-.5-2.5-1.5" stroke="#a855f7" strokeWidth="1" opacity="0.5" fill="none" />
    </>
  ),

  "trash-polka": (
    // Bold strokes + red accent — black + crimson
    <>
      <line x1="3" y1="3" x2="21" y2="21" stroke="#171717" strokeWidth="3" strokeLinecap="round" />
      <line x1="7" y1="2" x2="7" y2="11" stroke="#171717" strokeWidth="1.5" />
      <line x1="17" y1="13" x2="17" y2="22" stroke="#171717" strokeWidth="1.5" />
      <circle cx="18" cy="5" r="3.5" fill="#dc2626" opacity="0.3" />
      <circle cx="18" cy="5" r="3.5" stroke="#dc2626" strokeWidth="1.5" fill="none" />
    </>
  ),

  "new-school": (
    // Cartoon star — bright orange + yellow
    <>
      <path d="M12 2l2.5 6.5L21 10l-5 4.5L17.5 21 12 17.5 6.5 21 8 14.5 3 10l6.5-1.5z" fill="#f97316" opacity="0.15" />
      <path d="M12 2l2.5 6.5L21 10l-5 4.5L17.5 21 12 17.5 6.5 21 8 14.5 3 10l6.5-1.5z" stroke="#f97316" strokeWidth="1.5" fill="none" />
      <circle cx="10" cy="11" r="1" fill="#171717" />
      <circle cx="14" cy="11" r="1" fill="#171717" />
      <path d="M10 14c1 1 3 1 4 0" stroke="#171717" strokeWidth="1" fill="none" />
    </>
  ),

  surrealism: (
    // Melting clock — purple + amber
    <>
      <ellipse cx="12" cy="9" rx="7" ry="6" fill="#8b5cf6" opacity="0.1" />
      <ellipse cx="12" cy="9" rx="7" ry="6" stroke="#8b5cf6" strokeWidth="1.5" fill="none" />
      <path d="M12 6v3.5l2 1.5" stroke="#8b5cf6" strokeWidth="1.5" fill="none" />
      <path d="M19 11c1.5 3 1 7 0 9" stroke="#d97706" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M5 11c-1.5 3-1 7 0 9" stroke="#d97706" strokeWidth="1.5" fill="none" opacity="0.6" />
    </>
  ),

  "cover-up": (
    // Overlapping layers — grey behind, teal in front
    <>
      <rect x="3" y="3" width="11" height="11" rx="2" fill="#a8a29e" opacity="0.2" stroke="#a8a29e" strokeWidth="1.5" />
      <line x1="5" y1="5" x2="12" y2="12" stroke="#a8a29e" strokeWidth="1" opacity="0.5" />
      <rect x="10" y="10" width="11" height="11" rx="2" fill="#14b8a6" opacity="0.15" stroke="#14b8a6" strokeWidth="1.5" />
    </>
  ),

  portrait: (
    // Face silhouette — warm skin tone + charcoal
    <>
      <circle cx="12" cy="9" r="5" fill="#fbbf24" opacity="0.12" />
      <circle cx="12" cy="9" r="5" stroke="#44403c" strokeWidth="1.5" fill="none" />
      <path d="M5 21c0-4 3-7 7-7s7 3 7 7" stroke="#44403c" strokeWidth="1.5" fill="none" />
      <circle cx="10" cy="8" r="0.7" fill="#44403c" />
      <circle cx="14" cy="8" r="0.7" fill="#44403c" />
    </>
  ),

  biomechanical: (
    // Gears + circuits — steel grey + electric blue
    <>
      <circle cx="12" cy="12" r="4" fill="#3b82f6" opacity="0.1" />
      <circle cx="12" cy="12" r="4" stroke="#64748b" strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="12" r="1.5" fill="#64748b" />
      <path d="M12 2v3m0 14v3m10-10h-3M5 12H2" stroke="#64748b" strokeWidth="1.5" />
      <path d="M17.07 4.93l-2.12 2.12m-5.9 5.9l-2.12 2.12m12.14 0l-2.12-2.12m-5.9-5.9L6.93 4.93" stroke="#3b82f6" strokeWidth="1" opacity="0.5" />
    </>
  ),

  // — Artist Specializations —

  "color-specialist": (
    // Palette — multi-color dots
    <>
      <circle cx="12" cy="12" r="9" stroke="#78716c" strokeWidth="1.5" fill="none" />
      <circle cx="9" cy="8" r="1.8" fill="#ef4444" />
      <circle cx="14" cy="7" r="1.8" fill="#f59e0b" />
      <circle cx="8" cy="13" r="1.8" fill="#3b82f6" />
      <circle cx="12" cy="16" r="1.8" fill="#22c55e" />
      <ellipse cx="16.5" cy="13" rx="2.5" ry="2" fill="none" stroke="#78716c" strokeWidth="1.5" />
    </>
  ),

  "black-and-grey": (
    // Gradient split circle — black + grey
    <>
      <circle cx="12" cy="12" r="8" stroke="#44403c" strokeWidth="1.5" fill="none" />
      <path d="M12 4a8 8 0 010 16V4z" fill="#292524" opacity="0.6" />
      <path d="M12 4a8 8 0 000 16V4z" fill="#a8a29e" opacity="0.15" />
    </>
  ),

  "custom-design": (
    // Pencil — warm orange + dark
    <>
      <path d="M16 3l5 5-13 13H3v-5L16 3z" fill="#f97316" opacity="0.1" />
      <path d="M16 3l5 5-13 13H3v-5L16 3z" stroke="#44403c" strokeWidth="1.5" fill="none" />
      <path d="M14 5l5 5" stroke="#44403c" strokeWidth="1.5" />
      <path d="M3 21l3-1-2-2-1 3z" fill="#f97316" opacity="0.4" />
    </>
  ),

  "flash-tattoos": (
    // Lightning bolt — electric yellow + amber
    <>
      <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" fill="#fbbf24" opacity="0.2" />
      <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" stroke="#d97706" strokeWidth="1.5" fill="none" />
    </>
  ),

  // — Supplier Categories —

  "tattoo-supplies": (
    // Tattoo machine — teal + dark
    <>
      <rect x="8" y="3" width="8" height="11" rx="2" fill="#14b8a6" opacity="0.1" />
      <rect x="8" y="3" width="8" height="11" rx="2" stroke="#44403c" strokeWidth="1.5" fill="none" />
      <line x1="12" y1="14" x2="12" y2="20" stroke="#44403c" strokeWidth="1.5" />
      <circle cx="12" cy="21" r="1" fill="#14b8a6" />
      <line x1="6" y1="6" x2="8" y2="6" stroke="#44403c" strokeWidth="1.5" />
      <line x1="16" y1="6" x2="18" y2="6" stroke="#44403c" strokeWidth="1.5" />
    </>
  ),

  "aftercare-products": (
    // Shield with cross — green + white
    <>
      <path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3z" fill="#22c55e" opacity="0.12" />
      <path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3z" stroke="#16a34a" strokeWidth="1.5" fill="none" />
      <path d="M12 9v6m-3-3h6" stroke="#16a34a" strokeWidth="1.5" />
    </>
  ),

  "tattoo-removal": (
    // Laser zap — red + grey
    <>
      <path d="M16 8l-8 8-4-4 8-8z" fill="#ef4444" opacity="0.1" />
      <path d="M16 8l-8 8-4-4 8-8z" stroke="#64748b" strokeWidth="1.5" fill="none" />
      <path d="M20 4l-5 5" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
      <line x1="4" y1="20" x2="12" y2="20" stroke="#64748b" strokeWidth="1.5" />
    </>
  ),

  "piercing-studio": (
    // Hoop with gem — silver + teal gem
    <>
      <circle cx="12" cy="13" r="7" stroke="#a8a29e" strokeWidth="1.5" fill="none" />
      <circle cx="17" cy="8" r="2.5" fill="#14b8a6" opacity="0.25" />
      <circle cx="17" cy="8" r="2.5" stroke="#14b8a6" strokeWidth="1.5" fill="none" />
      <circle cx="17" cy="8" r="0.8" fill="#14b8a6" />
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
