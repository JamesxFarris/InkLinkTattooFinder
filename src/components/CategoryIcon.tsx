const icons: Record<string, React.ReactNode> = {
  // — Tattoo Styles —

  traditional: (
    // Anchor
    <path d="M12 2v1m0 18v-1m0 0c-4 0-7-2.5-7-6h2m5 6c4 0 7-2.5 7-6h-2M12 20V8m0 0a2 2 0 100-4 2 2 0 000 4z" />
  ),

  "neo-traditional": (
    // Rose
    <>
      <path d="M12 21c-4-1-7-4-7-8 0-2.5 1.5-4 3-4 1.2 0 2.3.7 3 1.8V5" />
      <path d="M12 5c1.5 0 3 1 3.5 2.5S16 11 12 10.8" />
      <path d="M12 5c-1.5 0-3 1-3.5 2.5S8 11 12 10.8" />
    </>
  ),

  realism: (
    // Eye
    <>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),

  japanese: (
    // Wave (Hokusai inspired)
    <path d="M2 17c2-3 4-5 6-5s3 2 4 2 2-1 3-2m-11 5c2-3 4-5 6-5s3 2 4 2 2-1.5 3.5-3M5 9c1-2 2.5-3 4-3s2 1 3 1 1.5-1 2.5-2" />
  ),

  blackwork: (
    // Bold filled diamond
    <>
      <rect x="5" y="5" width="14" height="14" rx="1" fill="currentColor" opacity="0.2" />
      <rect x="5" y="5" width="14" height="14" rx="1" />
      <path d="M5 5l14 14M19 5L5 19" />
    </>
  ),

  watercolor: (
    // Paint splashes
    <>
      <circle cx="9" cy="9" r="5" opacity="0.3" fill="currentColor" />
      <circle cx="15" cy="12" r="5" opacity="0.3" fill="currentColor" />
      <circle cx="10" cy="15" r="4" opacity="0.3" fill="currentColor" />
      <circle cx="9" cy="9" r="5" fill="none" />
      <circle cx="15" cy="12" r="5" fill="none" />
      <circle cx="10" cy="15" r="4" fill="none" />
    </>
  ),

  "fine-line": (
    // Single thin needle line with delicate detail
    <>
      <line x1="4" y1="20" x2="20" y2="4" />
      <circle cx="20" cy="4" r="1.5" fill="currentColor" />
      <path d="M7 14l2-2m2-2l2-2" strokeWidth="1" />
    </>
  ),

  tribal: (
    // Tribal curve pattern
    <path d="M4 20C4 12 8 8 12 8s4 2 4 5-2 4-4 2c-1.5-1.5-1-4 1-5.5S18 6 20 4" />
  ),

  geometric: (
    // Sacred geometry hexagon
    <>
      <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" fill="none" />
      <polygon points="12,6 17,9 17,15 12,18 7,15 7,9" fill="none" />
      <circle cx="12" cy="12" r="2" fill="none" />
    </>
  ),

  minimalist: (
    // Simple clean shapes
    <>
      <circle cx="12" cy="8" r="1.5" fill="currentColor" />
      <line x1="12" y1="11" x2="12" y2="18" />
      <line x1="8" y1="22" x2="16" y2="22" />
    </>
  ),

  dotwork: (
    // Dot stippling pattern in a triangle
    <>
      <circle cx="12" cy="5" r="1" fill="currentColor" />
      <circle cx="9" cy="10" r="1" fill="currentColor" />
      <circle cx="15" cy="10" r="1" fill="currentColor" />
      <circle cx="6" cy="15" r="1" fill="currentColor" />
      <circle cx="12" cy="15" r="1" fill="currentColor" />
      <circle cx="18" cy="15" r="1" fill="currentColor" />
      <circle cx="4" cy="20" r="1" fill="currentColor" />
      <circle cx="9" cy="20" r="1" fill="currentColor" />
      <circle cx="15" cy="20" r="1" fill="currentColor" />
      <circle cx="20" cy="20" r="1" fill="currentColor" />
    </>
  ),

  chicano: (
    // Praying hands (simplified)
    <>
      <path d="M12 4v2m0 0c-2 0-3 1.5-3 3v5l-1 2m4-10c2 0 3 1.5 3 3v5l1 2" />
      <path d="M8 16c0 2 1.5 4 4 4s4-2 4-4" />
    </>
  ),

  illustrative: (
    // Artist brush/pen
    <>
      <path d="M4 20l2-6L16 4l4 4L10 18l-6 2z" />
      <path d="M14.5 5.5l4 4" />
      <circle cx="7" cy="17" r="1.5" fill="currentColor" opacity="0.3" />
    </>
  ),

  "script-lettering": (
    // Stylized script A
    <path d="M5 18c2 0 3-1 4-3l3-9 3 9c1 2 2 3 4 3M8 14h8" />
  ),

  "trash-polka": (
    // Abstract splatter strokes
    <>
      <line x1="3" y1="3" x2="21" y2="21" strokeWidth="3" />
      <line x1="8" y1="2" x2="8" y2="10" strokeWidth="1" />
      <line x1="16" y1="14" x2="16" y2="22" strokeWidth="1" />
      <circle cx="18" cy="6" r="3" fill="currentColor" opacity="0.3" />
    </>
  ),

  "new-school": (
    // Cartoon star
    <>
      <path d="M12 2l2.5 6.5L21 10l-5 4.5L17.5 21 12 17.5 6.5 21 8 14.5 3 10l6.5-1.5z" />
    </>
  ),

  surrealism: (
    // Melting clock (Dali)
    <>
      <ellipse cx="12" cy="10" rx="7" ry="6" fill="none" />
      <path d="M12 7v3l2 1.5" />
      <path d="M19 12c1 3 1 6 0 8" />
      <path d="M5 12c-1 3-1 6 0 8" />
    </>
  ),

  "cover-up": (
    // Overlapping layers
    <>
      <rect x="3" y="3" width="12" height="12" rx="2" opacity="0.3" fill="currentColor" />
      <rect x="3" y="3" width="12" height="12" rx="2" />
      <rect x="9" y="9" width="12" height="12" rx="2" />
    </>
  ),

  portrait: (
    // Face silhouette
    <>
      <circle cx="12" cy="9" r="5" />
      <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
    </>
  ),

  biomechanical: (
    // Gear cog
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3m0 14v3m10-10h-3M5 12H2m15.07-7.07l-2.12 2.12M9.05 14.95l-2.12 2.12m10.14 0l-2.12-2.12M9.05 9.05L6.93 6.93" />
    </>
  ),

  // — Artist Specializations —

  "color-specialist": (
    // Color palette
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="7" r="1.5" fill="currentColor" />
      <circle cx="8" cy="11" r="1.5" fill="currentColor" />
      <circle cx="10" cy="15" r="1.5" fill="currentColor" />
      <circle cx="16" cy="12" r="2" />
    </>
  ),

  "black-and-grey": (
    // Half-filled circle (gradient feel)
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4a8 8 0 010 16V4z" fill="currentColor" opacity="0.3" />
    </>
  ),

  "custom-design": (
    // Pencil drawing
    <>
      <path d="M17 3l4 4-12 12H5v-4L17 3z" />
      <path d="M13 7l4 4" />
    </>
  ),

  "flash-tattoos": (
    // Lightning bolt
    <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
  ),

  // — Supplier Categories —

  "tattoo-supplies": (
    // Tattoo machine (simplified)
    <>
      <rect x="8" y="4" width="8" height="10" rx="2" />
      <line x1="12" y1="14" x2="12" y2="21" />
      <circle cx="12" cy="21" r="1" fill="currentColor" />
      <line x1="6" y1="7" x2="8" y2="7" />
      <line x1="16" y1="7" x2="18" y2="7" />
    </>
  ),

  "aftercare-products": (
    // Shield with cross (protection)
    <>
      <path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3z" />
      <path d="M12 9v6m-3-3h6" />
    </>
  ),

  "tattoo-removal": (
    // Eraser/laser beam
    <>
      <path d="M20 4l-9 9" />
      <path d="M16 8l-8 8-4-4 8-8z" />
      <line x1="4" y1="20" x2="12" y2="20" />
    </>
  ),

  "piercing-studio": (
    // Ring/hoop with bead
    <>
      <circle cx="12" cy="12" r="7" />
      <circle cx="17" cy="7" r="2" fill="currentColor" />
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
    // Fallback: generic tattoo needle
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        <line x1="5" y1="19" x2="19" y2="5" />
        <circle cx="19" cy="5" r="2" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {icon}
    </svg>
  );
}
