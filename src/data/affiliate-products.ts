/**
 * Tattoo affiliate products
 * ─────────────────────────────────────────────────────────────────────────────
 * HOW TO ADD A PRODUCT
 *   1. Find the right category array below (or add a new category object).
 *   2. Copy an existing product block and fill in the fields.
 *   3. Set `affiliateUrl` to your full affiliate link (Amazon, ShareASale, etc.).
 *   4. Set `image` to the product image URL provided by the affiliate programme.
 *      Leave as an empty string "" if you don't have one yet — a placeholder
 *      will be shown automatically.
 *   5. Set `badge` to a short label like "Best Seller" or "Editor's Pick",
 *      or omit it entirely for no badge.
 *
 * LEGAL NOTE
 *   The page already includes the required FTC affiliate disclosure.
 *   If you join Amazon Associates, you also need to add the Associates
 *   disclaimer to your site footer — see: associates.amazon.com/help/t5/
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type AffiliateProduct = {
  id: string;
  name: string;
  description: string;
  /** Full URL to the product image (e.g. from Amazon CDN or the affiliate's asset kit). Leave "" for a placeholder. */
  image: string;
  /** Display price string, e.g. "$14.99" or "From $24.99". */
  price: string;
  /** Your full affiliate link. */
  affiliateUrl: string;
  /** Optional short badge text shown on the card — e.g. "Best Seller", "Editor's Pick". */
  badge?: string;
};

export type AffiliateCategory = {
  id: string;
  name: string;
  description: string;
  products: AffiliateProduct[];
};

export const affiliateCategories: AffiliateCategory[] = [
  // ─── AFTERCARE ─────────────────────────────────────────────────────────────
  {
    id: "aftercare",
    name: "Tattoo Aftercare",
    description:
      "The products your artist actually recommends. Good aftercare protects your investment and keeps colours vibrant for years.",
    products: [
      {
        id: "hustle-butter",
        name: "Hustle Butter Deluxe",
        description:
          "The go-to aftercare balm used by professional artists and collectors worldwide. Vegan, fragrance-free, and works as a pre-session lubricant too.",
        image: "",
        price: "$14.99",
        affiliateUrl: "https://www.amazon.com/dp/B00CCQNLSE?tag=YOUR_TAG",
        badge: "Most Popular",
      },
      {
        id: "saniderm",
        name: "Saniderm Tattoo Bandage",
        description:
          "Breathable, waterproof second-skin bandage that protects fresh tattoos during the critical first days of healing. Reduces scabbing and plasma loss.",
        image: "",
        price: "$19.99",
        affiliateUrl: "https://www.amazon.com/dp/B00K8L5LNS?tag=YOUR_TAG",
        badge: "Artist Approved",
      },
      {
        id: "h2ocean",
        name: "H2Ocean Tattoo Aftercare Foam Soap",
        description:
          "Gentle foam cleanser with sea salt and tea tree oil. Ideal for washing fresh tattoos without irritating the healing skin.",
        image: "",
        price: "$12.99",
        affiliateUrl: "https://www.amazon.com/dp/B002OB2OSK?tag=YOUR_TAG",
      },
      {
        id: "aquaphor",
        name: "Aquaphor Healing Ointment",
        description:
          "A dermatologist-recommended staple for the first 2–3 days of tattoo healing. Creates a protective barrier while keeping skin moisturised.",
        image: "",
        price: "$9.99",
        affiliateUrl: "https://www.amazon.com/dp/B00282P8NO?tag=YOUR_TAG",
      },
    ],
  },

  // ─── SUN PROTECTION ────────────────────────────────────────────────────────
  {
    id: "sun-protection",
    name: "Sun Protection",
    description:
      "UV exposure is the fastest way to fade a tattoo. These are the SPF products worth keeping in your rotation.",
    products: [
      {
        id: "ink-defender",
        name: "Tattoo Defender SPF 50+ Sunscreen",
        description:
          "Formulated specifically for tattooed skin. Broad-spectrum SPF 50+ with no white cast — works on all skin tones.",
        image: "",
        price: "$18.00",
        affiliateUrl: "https://www.amazon.com/s?k=tattoo+spf+sunscreen&tag=YOUR_TAG",
        badge: "Editor's Pick",
      },
      {
        id: "coppertone-sport",
        name: "Coppertone Sport SPF 50 Spray",
        description:
          "A reliable broad-spectrum SPF 50 that dries quickly and doesn't leave residue. Great for everyday use on arms, legs, and anywhere else you have ink.",
        image: "",
        price: "$11.99",
        affiliateUrl: "https://www.amazon.com/dp/B00KX66O1U?tag=YOUR_TAG",
      },
    ],
  },

  // ─── STENCIL & SETUP ───────────────────────────────────────────────────────
  {
    id: "stencil-setup",
    name: "Stencil & Setup",
    description:
      "For artists and serious enthusiasts. The supplies that go into making a clean, precise tattoo from start to finish.",
    products: [
      {
        id: "stencil-stuff",
        name: "Stencil Stuff Transfer Solution",
        description:
          "The industry standard for transferring stencils cleanly onto skin. Works with thermal paper and freehand stencils. Long-lasting and easy to remove.",
        image: "",
        price: "$17.99",
        affiliateUrl: "https://www.amazon.com/dp/B001GFSPHS?tag=YOUR_TAG",
        badge: "Industry Standard",
      },
      {
        id: "thermal-paper",
        name: "Spirit Classic Thermal Stencil Paper",
        description:
          "Professional-grade thermal transfer paper for clean, detailed stencil transfers. Works with any standard thermal copier.",
        image: "",
        price: "$24.99",
        affiliateUrl: "https://www.amazon.com/s?k=spirit+thermal+stencil+paper&tag=YOUR_TAG",
      },
      {
        id: "green-soap",
        name: "Tattoo Green Soap (Concentrate)",
        description:
          "A must-have for any tattoo session. Used to clean the skin before and during tattooing. Dilute with distilled water before use.",
        image: "",
        price: "$9.99",
        affiliateUrl: "https://www.amazon.com/s?k=tattoo+green+soap+concentrate&tag=YOUR_TAG",
      },
    ],
  },

  // ─── PRACTICE & LEARNING ───────────────────────────────────────────────────
  {
    id: "practice",
    name: "Practice & Learning",
    description:
      "For apprentices and new collectors who want to understand the craft better.",
    products: [
      {
        id: "fake-skin",
        name: "Yuelong Fake Tattoo Practice Skin",
        description:
          "Double-sided silicone practice skin with a texture close to real skin. Ideal for practising line work, shading, and colour before working on a client.",
        image: "",
        price: "$22.99",
        affiliateUrl: "https://www.amazon.com/s?k=tattoo+practice+skin+silicone&tag=YOUR_TAG",
      },
      {
        id: "drawing-book",
        name: "The Complete Idiot's Guide to Getting a Tattoo",
        description:
          "A practical guide for anyone planning their first (or next) tattoo — covering design choice, artist selection, pain, aftercare, and removal.",
        image: "",
        price: "$16.99",
        affiliateUrl: "https://www.amazon.com/s?k=getting+a+tattoo+guide+book&tag=YOUR_TAG",
        badge: "Great Gift",
      },
    ],
  },
];
