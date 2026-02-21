export const dynamic = "force-dynamic";

import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd, faqJsonLd, breadcrumbJsonLd } from "@/components/JsonLd";
import { getAllCategories } from "@/lib/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tattoo Styles Guide — Every Style Explained | InkLink Tattoo Finder",
  description:
    "Learn about every tattoo style from Traditional to Biomechanical. See what makes each style unique, what to expect, and find artists who specialize in it.",
  alternates: { canonical: "/styles" },
};

type StyleGuide = {
  slug: string;
  name: string;
  icon: string;
  headline: string;
  description: string;
  characteristics: string[];
  bestFor: string;
  example: string;
};

const styleGuides: StyleGuide[] = [
  {
    slug: "traditional",
    name: "Traditional (American Traditional)",
    icon: "⚓",
    headline: "Bold lines, bright colors, and timeless Americana",
    description:
      "American Traditional is one of the oldest and most recognizable tattoo styles. Pioneered by legends like Sailor Jerry, it features thick black outlines, a limited but vibrant color palette (red, green, yellow, blue), and iconic imagery like anchors, eagles, roses, and pin-up girls. The style is built to age well — those bold lines hold up for decades.",
    characteristics: [
      "Thick, clean black outlines",
      "Limited bold color palette",
      "Iconic imagery: anchors, skulls, roses, eagles, daggers",
      "Flat color fills with minimal shading",
      "Highly readable from a distance",
    ],
    bestFor:
      "Anyone who wants a timeless tattoo that ages gracefully. Great for first tattoos because the style is forgiving and holds up over time.",
    example:
      "A classic anchor with a banner reading a loved one's name, filled with bold red and blue.",
  },
  {
    slug: "neo-traditional",
    name: "Neo-Traditional",
    icon: "🌹",
    headline: "Traditional roots with modern detail and color range",
    description:
      "Neo-Traditional takes the bold outlines of American Traditional and expands the palette and detail. You get richer color gradients, more complex compositions, and a wider range of subject matter — from ornate animal portraits to elaborate floral arrangements. Think of it as Traditional's more detailed, art-nouveau-influenced sibling.",
    characteristics: [
      "Bold outlines like Traditional, but with more variation in line weight",
      "Expanded color palette with gradients and blending",
      "Art Nouveau and decorative influences",
      "More detailed shading and depth than Traditional",
      "Often features animals, flowers, and portraits",
    ],
    bestFor:
      "People who love the boldness of Traditional but want more color variety and intricate detail.",
    example:
      "A fox portrait surrounded by ornate flowers with rich jewel-tone colors and gold accents.",
  },
  {
    slug: "realism",
    name: "Realism",
    icon: "📷",
    headline: "Photorealistic imagery brought to life on skin",
    description:
      "Realism tattoos aim to replicate photographs or real life as closely as possible. This style demands exceptional technical skill — artists use subtle shading, precise detail, and careful light/shadow work to create tattoos that look like actual photos on skin. Portraits, nature scenes, and animals are popular subjects.",
    characteristics: [
      "No visible outlines — relies on shading and contrast",
      "Photographic level of detail",
      "Extensive use of light, shadow, and highlights",
      "Can be done in color or black and grey",
      "Requires multiple sessions for large pieces",
    ],
    bestFor:
      "Memorial portraits, nature lovers, or anyone who wants a tattoo that looks like a photograph. Choose an artist with a strong portfolio — skill varies widely in this style.",
    example:
      "A black and grey portrait of a loved one with lifelike skin texture and light catching in the eyes.",
  },
  {
    slug: "japanese",
    name: "Japanese (Irezumi)",
    icon: "🐉",
    headline: "Large-scale, story-driven art rooted in centuries of tradition",
    description:
      "Japanese tattooing (Irezumi) is one of the most respected traditions in the tattoo world. Designs typically feature large-scale compositions with specific symbolic imagery — koi fish (perseverance), dragons (wisdom and strength), cherry blossoms (the fleeting nature of life), and waves. Background elements like wind bars, clouds, and water tie the composition together into a cohesive bodysuit or sleeve.",
    characteristics: [
      "Large-scale compositions designed to flow with the body",
      "Symbolic imagery with specific cultural meanings",
      "Background elements (wind, water, clouds) unify the design",
      "Bold outlines with smooth color gradients",
      "Often planned as full sleeves, back pieces, or bodysuits",
    ],
    bestFor:
      "People committed to larger pieces who appreciate symbolism and storytelling. Japanese work typically requires multiple sessions and long-term planning with your artist.",
    example:
      "A full sleeve featuring a koi fish swimming upstream through crashing waves with cherry blossoms falling around it.",
  },
  {
    slug: "blackwork",
    name: "Blackwork",
    icon: "◼",
    headline: "Bold, graphic, and striking in pure black ink",
    description:
      "Blackwork encompasses any tattoo done primarily or entirely in black ink. This ranges from heavy solid black fills and geometric patterns to ornamental designs and illustrative work. The style is versatile — it can be minimalist or maximalist, delicate or bold. What ties it together is the commitment to black ink as the sole medium.",
    characteristics: [
      "Exclusively or predominantly black ink",
      "Ranges from solid fills to intricate patterns",
      "High contrast and visual impact",
      "Includes sub-styles like ornamental, tribal, and geometric blackwork",
      "Ages very well due to the density of ink",
    ],
    bestFor:
      "Anyone who loves high-contrast, graphic tattoos. Excellent for cover-ups due to the heavy ink saturation.",
    example:
      "A geometric mandala on the forearm with solid black fills transitioning into intricate dotwork patterns.",
  },
  {
    slug: "watercolor",
    name: "Watercolor",
    icon: "🎨",
    headline: "Painterly splashes of color that look like art on canvas",
    description:
      "Watercolor tattoos mimic the look of watercolor paintings — soft color gradients, splashes, drips, and blends that appear to flow freely on the skin. Many artists combine watercolor backgrounds with fine-line or illustrative elements to give the design structure. Pure watercolor (without outlines) can fade faster, so many artists incorporate subtle line work for longevity.",
    characteristics: [
      "Soft color transitions and gradients",
      "Paint splash and drip effects",
      "Often combined with fine-line or illustrative elements",
      "No heavy outlines (or very minimal ones)",
      "Vibrant, saturated colors",
    ],
    bestFor:
      "People who want something artistic and unique. Best with an artist who specifically specializes in this style, as the technique differs significantly from traditional tattooing.",
    example:
      "A hummingbird rendered in fine black lines with an explosion of watercolor blues, purples, and pinks splashing behind it.",
  },
  {
    slug: "fine-line",
    name: "Fine Line",
    icon: "✨",
    headline: "Delicate, precise, and beautifully understated",
    description:
      "Fine line tattooing uses thin, precise needles to create delicate designs with incredible detail. Popular subjects include botanicals, small symbols, script, micro-portraits, and minimalist illustrations. The style has surged in popularity thanks to its elegant, understated look. Fine line work requires a very steady hand and specialized equipment.",
    characteristics: [
      "Very thin, consistent line work",
      "Delicate and detailed compositions",
      "Often single-needle or small needle groupings",
      "Minimal shading, relies on line work for depth",
      "Popular for small to medium-sized pieces",
    ],
    bestFor:
      "People who want subtle, elegant tattoos. Great for first tattoos or visible placements where you want something refined rather than bold.",
    example:
      "A single-needle botanical illustration of wildflowers wrapping delicately around the inner forearm.",
  },
  {
    slug: "tribal",
    name: "Tribal",
    icon: "🔱",
    headline: "Bold black patterns rooted in indigenous traditions",
    description:
      "Tribal tattooing has roots in cultures worldwide — Polynesian, Maori, Samoan, Celtic, and many others. Authentic tribal work carries deep cultural significance, with patterns that tell stories of heritage, rank, and personal history. Modern tribal tattoos often draw from these traditions with bold black patterns, flowing curves, and sharp points designed to complement the body's natural contours.",
    characteristics: [
      "Solid black ink with no color",
      "Bold, flowing patterns that follow body contours",
      "Cultural roots in Polynesian, Maori, Celtic, and other traditions",
      "Symmetrical and organic shapes",
      "Designed to wrap around muscles and limbs",
    ],
    bestFor:
      "People who want bold, body-contouring designs. If you want culturally authentic work, seek out an artist with genuine knowledge of the specific tradition.",
    example:
      "A Polynesian-inspired half-sleeve with interlocking patterns representing family lineage and personal strength.",
  },
  {
    slug: "geometric",
    name: "Geometric",
    icon: "🔷",
    headline: "Sacred geometry, patterns, and mathematical precision",
    description:
      "Geometric tattoos use shapes, patterns, and mathematical precision to create visually striking designs. From sacred geometry (Flower of Life, Metatron's Cube) to animal portraits built from geometric shapes, this style appeals to those who find beauty in symmetry and structure. Precision is everything — even small inconsistencies are visible.",
    characteristics: [
      "Precise lines and symmetrical shapes",
      "Sacred geometry, mandalas, and tessellations",
      "Can be combined with other styles (geometric realism, geometric animals)",
      "Typically black ink, though color variations exist",
      "Requires extremely precise, steady hand work",
    ],
    bestFor:
      "Math and design lovers, people who want visually structured tattoos with deep symbolic meaning.",
    example:
      "A lion portrait where half the face is realistic and half dissolves into geometric triangles and hexagons.",
  },
  {
    slug: "minimalist",
    name: "Minimalist",
    icon: "○",
    headline: "Less is more — simple, clean, and intentional",
    description:
      "Minimalist tattoos strip designs down to their essence. Using clean lines, simple shapes, and plenty of negative space, this style makes a statement through restraint. Small symbols, single-line drawings, tiny icons, and simple text are all popular choices. The appeal is in the elegance of simplicity.",
    characteristics: [
      "Clean, simple lines",
      "Lots of negative space",
      "Small to medium size",
      "Often single-line continuous drawings",
      "Minimal or no shading",
    ],
    bestFor:
      "First-timers, people who prefer subtle tattoos, or anyone who wants something small and meaningful without a big commitment.",
    example:
      "A single continuous-line drawing of a mountain range on the inner wrist, no bigger than two inches.",
  },
  {
    slug: "dotwork",
    name: "Dotwork",
    icon: "⠿",
    headline: "Intricate designs created entirely from individual dots",
    description:
      "Dotwork is exactly what it sounds like — tattoos created by placing thousands of individual dots to build up shading, patterns, and imagery. The technique creates a distinctive textured look that differs from traditional line-and-shade work. Dotwork is commonly used for mandalas, geometric designs, and ornamental patterns, but skilled artists can create virtually anything with dots alone.",
    characteristics: [
      "Designs built entirely from individual dots",
      "Unique textured appearance",
      "Gradient shading through dot density",
      "Often combined with geometric or ornamental styles",
      "Extremely time-intensive process",
    ],
    bestFor:
      "People who want a unique texture and are willing to sit through longer sessions. The meditative, hand-poked variant (stick-and-poke) is also popular.",
    example:
      "A large mandala on the sternum with dense dotwork at the center fading to sparse dots at the edges, creating a gradient effect.",
  },
  {
    slug: "chicano",
    name: "Chicano",
    icon: "🙏",
    headline: "Black and grey storytelling rooted in Mexican-American culture",
    description:
      "Chicano tattooing emerged from Mexican-American communities in Southern California. The style is characterized by fine black and grey work, smooth shading, and cultural imagery — religious iconography (praying hands, the Virgin Mary), lowriders, sugar skulls, roses, and script lettering. The style carries deep cultural significance and tells stories of faith, family, struggle, and pride.",
    characteristics: [
      "Black and grey ink exclusively",
      "Smooth, gradient shading",
      "Fine line work with script lettering",
      "Religious, cultural, and family imagery",
      "Storytelling through connected pieces",
    ],
    bestFor:
      "People who connect with the cultural roots or appreciate the beauty of black and grey portraiture and lettering.",
    example:
      "A praying hands piece with rosary beads, a banner with a family name in elaborate script, and roses framing the composition.",
  },
  {
    slug: "illustrative",
    name: "Illustrative",
    icon: "🖊️",
    headline: "Where drawing and illustration meet skin",
    description:
      "Illustrative tattooing bridges the gap between fine art illustration and tattoo. It looks like a drawing or print brought to life on skin — think book illustrations, editorial art, or graphic novel imagery. The style is broad and flexible, borrowing techniques from etching, woodcut, sketch work, and pen-and-ink illustration.",
    characteristics: [
      "Looks like a drawing or print on skin",
      "Visible line work with artistic shading (crosshatching, stippling)",
      "Wide range of subject matter",
      "Often combines elements of other styles",
      "Can be highly detailed or loose and sketchy",
    ],
    bestFor:
      "Art lovers, book nerds, and anyone who wants their tattoo to look like it was drawn rather than tattooed.",
    example:
      "A detailed botanical illustration of a peony with visible crosshatching for shading, resembling a vintage engraving.",
  },
  {
    slug: "script-lettering",
    name: "Script & Lettering",
    icon: "𝓐",
    headline: "Words that matter, crafted in custom typography",
    description:
      "Script and lettering tattoos transform words into art. From elegant cursive and calligraphy to bold block letters and graffiti-inspired fonts, the style of lettering sets the tone for the message. Good lettering artists understand typography, spacing, flow, and how text reads on curved body surfaces — this is harder than it looks.",
    characteristics: [
      "Custom typography and font design",
      "Styles range from calligraphy to graffiti to typewriter fonts",
      "Spacing and flow designed for the body's contours",
      "Often combined with small illustrative elements",
      "Readability is critical — line weight and sizing matter",
    ],
    bestFor:
      "Quotes, names, dates, and meaningful phrases. Choose an artist with strong lettering in their portfolio — bad lettering is one of the most common tattoo regrets.",
    example:
      "A meaningful quote in flowing script across the ribs, with varying line weights that give the letters a calligraphic quality.",
  },
  {
    slug: "trash-polka",
    name: "Trash Polka",
    icon: "🔴",
    headline: "Chaotic, collage-style art in red and black",
    description:
      "Trash Polka was created by German artists Simone Pfaff and Volko Merschky. It combines realistic imagery with abstract, graphic elements — smeared paint strokes, geometric shapes, text fragments, and bold splashes of red and black. The result looks like a mixed-media collage on skin. It's intentionally chaotic, breaking traditional tattoo rules in favor of artistic expression.",
    characteristics: [
      "Exclusively red and black ink",
      "Combines realism with abstract/graphic elements",
      "Collage-like compositions",
      "Paint strokes, smears, and splatter effects",
      "Intentionally chaotic and unconventional layout",
    ],
    bestFor:
      "People who want something truly different and are comfortable with a bold, avant-garde aesthetic. Not for the faint-hearted.",
    example:
      "A realistic clock face with smeared red paint strokes, geometric overlays, and fragments of typewriter text scattered across the upper arm.",
  },
  {
    slug: "new-school",
    name: "New School",
    icon: "🎪",
    headline: "Cartoon-like, exaggerated, and bursting with color",
    description:
      "New School is the loud, fun cousin of Traditional tattooing. It features exaggerated proportions, cartoon-like characters, wild color palettes, and a sense of humor. Think graffiti art, comic books, and 90s cartoons. Heavy outlines are still present (borrowed from Traditional), but everything is cranked up — bigger, brighter, and more expressive.",
    characteristics: [
      "Exaggerated proportions and cartoon-like characters",
      "Extremely vibrant and varied color palette",
      "Heavy outlines with dynamic compositions",
      "Influenced by graffiti, comics, and pop culture",
      "Playful and humorous subject matter",
    ],
    bestFor:
      "People who don't take themselves too seriously and want a bold, colorful, fun tattoo that stands out.",
    example:
      "A cartoonish graffiti-style frog wearing a crown, sitting on a mushroom with exaggerated proportions and neon colors.",
  },
  {
    slug: "surrealism",
    name: "Surrealism",
    icon: "🌀",
    headline: "Dreamlike imagery that bends reality",
    description:
      "Surrealist tattoos draw from the art movement pioneered by Salvador Dalí and René Magritte. Expect melting objects, impossible scenes, dreamlike compositions, and imagery that challenges perception. The style often combines realistic rendering with impossible or fantastical elements, creating tattoos that are conversation starters.",
    characteristics: [
      "Dreamlike, impossible scenes",
      "Realistic rendering of unrealistic subjects",
      "Optical illusions and visual tricks",
      "Often combines multiple styles (realism + abstract)",
      "Complex compositions requiring skilled planning",
    ],
    bestFor:
      "Creative thinkers, art lovers, and anyone who wants a tattoo that makes people look twice.",
    example:
      "A realistically rendered hand holding a melting hourglass with butterflies emerging from the sand, set against an impossible landscape.",
  },
  {
    slug: "biomechanical",
    name: "Biomechanical",
    icon: "⚙️",
    headline: "Mechanical and organic fusion beneath the skin",
    description:
      "Biomechanical tattoos create the illusion that the skin has been peeled back to reveal mechanical or alien structures underneath — gears, pistons, cables, and circuits intertwined with muscle and bone. Popularized by H.R. Giger's art for the Alien franchise, this style requires exceptional understanding of anatomy, perspective, and 3D rendering.",
    characteristics: [
      "Creates illusion of machinery beneath the skin",
      "Combines organic (muscle, bone) with mechanical elements",
      "Heavy use of 3D shading and perspective",
      "Often designed as ripped-skin or torn-flesh effects",
      "Custom-designed to fit each person's body contours",
    ],
    bestFor:
      "Sci-fi fans, people who love optical illusions, and anyone who wants a tattoo that looks like it's part of their body's structure.",
    example:
      "A torn-skin forearm piece revealing intricate gears, pistons, and cables intertwined with realistic muscle fibers underneath.",
  },
  {
    slug: "portrait",
    name: "Portrait",
    icon: "👤",
    headline: "Realistic faces of people and pets preserved in ink",
    description:
      "Portrait tattoos capture the likeness of real people, beloved pets, or iconic figures. This is widely considered one of the most difficult tattoo styles — even slight inaccuracies in proportions or shading are immediately noticeable because our brains are wired to recognize faces. The best portrait artists can capture not just appearance but emotion and personality.",
    characteristics: [
      "Photorealistic rendering of faces",
      "Extremely precise proportions and shading",
      "Available in color or black and grey",
      "Requires high-quality reference photos",
      "One of the most technically demanding styles",
    ],
    bestFor:
      "Memorial pieces, honoring loved ones, or celebrating personal heroes. Research your artist extensively — this style has the widest skill gap in the industry.",
    example:
      "A black and grey portrait of a grandmother with soft, realistic shading that captures the warmth in her eyes and the texture of her skin.",
  },
  {
    slug: "cover-up",
    name: "Cover-Up",
    icon: "🔄",
    headline: "Transform an old tattoo into something you love",
    description:
      "Cover-up tattooing is the art of designing a new tattoo that completely conceals an existing one. This requires specialized skill — the artist must work with (not against) the existing ink, using strategic design choices, darker tones, and clever placement to hide what's underneath. A good cover-up artist can turn a tattoo you regret into one you're proud of.",
    characteristics: [
      "New design strategically hides existing tattoo",
      "Often uses darker colors and denser ink",
      "Design must work around the shape and density of the old tattoo",
      "May require a laser fading session first for best results",
      "Requires specialized planning and consultation",
    ],
    bestFor:
      "Anyone with an old tattoo they no longer love. A consultation with a cover-up specialist is essential — they'll advise what's possible based on your existing ink.",
    example:
      "An old faded tribal armband transformed into a detailed forest landscape with trees, mountains, and a night sky.",
  },
];

const styleFaq = styleGuides.map((s) => ({
  question: `What is a ${s.name} tattoo?`,
  answer: s.description,
}));

export default async function StylesGuidePage() {
  const categories = await getAllCategories();

  // Map DB categories to our guide entries for linking
  const categoryMap = new Map(categories.map((c) => [c.slug, c]));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={faqJsonLd(styleFaq)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Home", href: "/" },
          { label: "Tattoo Styles Guide" },
        ])}
      />

      <Breadcrumbs
        items={[{ label: "Tattoo Styles Guide" }]}
      />

      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 sm:text-4xl">
          Tattoo Styles Guide
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-600 dark:text-stone-400">
          Not sure what style you want? This guide breaks down every major tattoo
          style — what it looks like, what makes it unique, and what to look for
          in an artist. Click any style to find artists who specialize in it.
        </p>
      </div>

      {/* Quick nav */}
      <nav className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
          Jump to Style
        </h2>
        <div className="flex flex-wrap gap-2">
          {styleGuides.map((s) => (
            <a
              key={s.slug}
              href={`#${s.slug}`}
              className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 transition-colors hover:border-teal-500 hover:text-teal-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:border-teal-500 dark:hover:text-teal-400"
            >
              {s.icon} {s.name.split(" (")[0]}
            </a>
          ))}
        </div>
      </nav>

      {/* Style sections */}
      <div className="mt-12 space-y-16">
        {styleGuides.map((style) => {
          const dbCategory = categoryMap.get(style.slug);
          return (
            <article
              key={style.slug}
              id={style.slug}
              className="scroll-mt-24 rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-700 dark:bg-stone-900 sm:p-8"
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl">{style.icon}</span>
                <div>
                  <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                    {style.name}
                  </h2>
                  <p className="mt-1 text-lg font-medium text-teal-600 dark:text-teal-400">
                    {style.headline}
                  </p>
                </div>
              </div>

              <p className="mt-4 leading-relaxed text-stone-600 dark:text-stone-400">
                {style.description}
              </p>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    Key Characteristics
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {style.characteristics.map((c) => (
                      <li
                        key={c}
                        className="flex items-start gap-2 text-sm text-stone-600 dark:text-stone-400"
                      >
                        <svg
                          className="mt-0.5 h-4 w-4 shrink-0 text-teal-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                      Best For
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                      {style.bestFor}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                      Example
                    </h3>
                    <p className="mt-2 text-sm italic leading-relaxed text-stone-500 dark:text-stone-400">
                      &ldquo;{style.example}&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              {dbCategory && (
                <div className="mt-6 border-t border-stone-100 pt-4 dark:border-stone-800">
                  <Link
                    href={`/categories/${style.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-teal-500 transition-colors hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300"
                  >
                    Find {style.name.split(" (")[0]} Artists Near You
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* CTA */}
      <section className="mt-16 rounded-2xl bg-stone-900 p-8 text-center sm:p-12">
        <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
          Ready to find your artist?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-stone-400">
          Browse thousands of tattoo shops and artists across the US. Filter by
          style, city, and ratings to find the perfect match.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/search"
            className="rounded-full bg-teal-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 transition-all hover:bg-teal-600 hover:shadow-xl"
          >
            Search Artists
          </Link>
          <Link
            href="/tattoo-shops"
            className="rounded-full border border-stone-600 px-8 py-3 text-sm font-semibold text-stone-300 transition-colors hover:border-stone-400 hover:text-white"
          >
            Browse by State
          </Link>
        </div>
      </section>
    </div>
  );
}
