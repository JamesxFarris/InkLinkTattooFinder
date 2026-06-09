/**
 * Seed script: 5 new blog posts by Jordan Lydia
 * Run: npx tsx scripts/seed-blogs-2.ts
 */
import { PrismaClient } from "@prisma/client";

const DB = process.env.DATABASE_URL;
if (!DB) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const AUTHOR_ID = 5; // Jordan Lydia

const posts: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
}[] = [
  // ─── 1. How Long Does a Tattoo Take? ───────────────────────────────────────
  {
    title: "How Long Does a Tattoo Take? (Time by Size & Style)",
    slug: "how-long-does-a-tattoo-take",
    excerpt:
      "A tiny wrist tattoo might take 30 minutes. A full sleeve can take 30+ hours spread across months. Here's a realistic breakdown of how long tattoos take based on size, style, and placement.",
    content: `# How Long Does a Tattoo Take? (Time by Size & Style)

One of the most common pre-appointment questions is simple: *how long is this going to take?* It matters for scheduling, for managing discomfort, and for knowing what you're signing up for. The range is enormous — from a 20-minute flash piece to a multi-year sleeve project — so let's break it down properly.

## Quick Reference: Time by Tattoo Size

| Tattoo Size | Typical Session Time |
|-------------|---------------------|
| Tiny (under 2 inches) | 30 minutes – 1 hour |
| Small (2–4 inches) | 1 – 2 hours |
| Medium (4–6 inches) | 2 – 4 hours |
| Large (6–10 inches) | 4 – 6 hours |
| Half sleeve | 8 – 15 hours (multiple sessions) |
| Full sleeve | 15 – 40 hours (multiple sessions) |
| Back piece | 20 – 80+ hours (multiple sessions) |

These are genuine estimates — your specific design, chosen style, and artist's pace will all shift things.

## What Actually Affects How Long It Takes?

### Design Complexity

A single-colour traditional rose takes far less time than a hyper-realistic portrait of the same size. Detail density is the biggest time variable within a given size. Fine linework, intricate shading, and illustrative styles with lots of micro-detail all add hours.

### Colour vs. Black and Grey

Colour tattoos generally take longer. Each colour requires a separate needle or a pass with a clean needle, and building up saturated colour takes multiple layers. A piece that might take 3 hours in black and grey could take 4–5 hours in full colour.

### Tattoo Style

Some styles are inherently more time-intensive:

- **Realism / Photorealism** — extremely time-intensive; detail, shading, and highlight work takes hours per square inch
- **Japanese traditional** — large compositions with intricate background fill (water, clouds, wind bars) eat up time fast
- **Fine line** — small but slow; precision required means the artist can't rush
- **Watercolour** — layered passes for the soft blended effect add time
- **Bold traditional / neo-traditional** — generally faster; thick lines and flat fill move more quickly
- **Blackwork / geometric** — depends heavily on size; solid fills and precise geometry can be slow

### Artist Speed

Every artist has their own pace. Some work quickly and confidently; others are methodical and deliberate. Slower doesn't mean worse — many of the most detail-oriented artists take their time precisely because the result is better. Ask your artist approximately how long they expect your piece to take; they'll give you a realistic estimate.

### Placement and Skin

Areas with curves, bone proximity, or skin that moves a lot (ribs, hands, feet, necks) slow things down. The artist has to reposition, the client shifts, and the surface is less forgiving than a flat forearm or thigh.

### Setup and Breaks

Every session includes setup time — transferring the stencil, positioning, adjustments — which can add 20–45 minutes before the needle touches skin. Longer sessions also include breaks, which are necessary but add to total time.

## Multi-Session Work: What to Expect

Any large piece will be broken into multiple sessions. This isn't just about endurance — it's about the skin. Overworking an area in a single sitting causes trauma that affects healing and ink retention.

Most artists recommend:

- **Half sleeve:** 2–4 sessions, spaced 4–6 weeks apart for healing
- **Full sleeve:** 4–10+ sessions over 6 months to 2+ years
- **Back piece:** 10–30+ sessions depending on coverage and style

The spacing isn't wasted time — it's when your skin heals, which determines how well the tattoo holds up long-term.

## How Long Should a Session Be?

Most artists cap sessions at 4–6 hours for good reason. After that point:

- Your skin becomes overworked and harder to tattoo cleanly
- Your pain tolerance drops significantly
- The artist's concentration and hand steadiness also decline
- Ink retention can suffer in areas done at the end of a long session

Some experienced collectors push to 8-hour sessions, but that's generally not recommended for large body areas or first-time clients.

## Tips for Managing Long Sessions

- **Eat a full meal 1–2 hours before** — blood sugar stability matters a lot over multiple hours
- **Bring snacks** — especially something with sugar for a midpoint boost
- **Stay hydrated** — dehydration amplifies discomfort
- **Wear comfortable clothing** — you'll be in one position for a long time
- **Take breaks when offered** — don't tough it out unnecessarily
- **Split big pieces across sessions** — better result, better experience

## Finding Artists Who Work Efficiently

If you want to get a sense of how an artist structures large projects, ask them during your consultation. Most established artists who do large-scale work have a clear approach to session planning. Browse shops and portfolios on [InkLink](/) to find artists specialising in the style and scale you're after — their gallery of completed large work is the best indicator of what you can expect.
`,
  },

  // ─── 2. How to Prepare for Your First Tattoo ───────────────────────────────
  {
    title: "How to Prepare for Your First Tattoo: A Complete Checklist",
    slug: "how-to-prepare-for-your-first-tattoo",
    excerpt:
      "Getting your first tattoo? What you do in the days before — and hours of — your appointment makes a real difference to both the experience and how well it heals. Here's the full checklist.",
    content: `# How to Prepare for Your First Tattoo: A Complete Checklist

First tattoos are exciting. They're also a little nerve-wracking, mostly because of the unknown. The good news: preparation takes most of that anxiety off the table. What you do before your appointment genuinely affects the experience, how the tattoo looks going in, and how well it heals. Here's everything to know.

## In the Days Before

### Get a Good Night's Sleep

Fatigue lowers your pain threshold and slows healing. Aim for 7–9 hours the night before your appointment. If you're anxious, try keeping your evening routine normal — don't stay up overthinking it.

### Stay Hydrated

Well-hydrated skin takes ink more cleanly and heals faster. Drink more water than usual in the 2–3 days leading up to your session. Not just the morning of — it takes a couple of days for proper hydration to show up in your skin.

### Moisturise the Area

Keep the skin being tattooed well-moisturised in the days before. Dry, flakey skin is harder to tattoo and can affect line quality. Use an unscented lotion daily. Stop moisturising the morning of your appointment — let the skin dry naturally before you go in.

### Avoid Sunburn

Tattooing over sunburned skin isn't possible — any reputable artist will reschedule. Keep the area covered and out of strong sun for at least a week before your appointment.

### Skip Alcohol for 24 Hours

Alcohol thins your blood, which leads to more bleeding during the session. More bleeding means the artist has to wipe more frequently and the ink can be pushed out of the skin before it sets. Avoid it the day before and the day of.

### Don't Take Aspirin or Ibuprofen

These are blood thinners too. If you need a painkiller, paracetamol (acetaminophen) is fine. Avoid aspirin or ibuprofen for at least 24 hours before.

### Confirm Your Appointment Details

Double-check the time, location, and anything your artist asked you to bring (reference images, deposit confirmation, etc.). Showing up late or unprepared creates unnecessary stress.

---

## The Morning Of

### Eat a Proper Meal

Have a full meal 1–2 hours before your appointment. Not a snack — a proper meal with protein, carbs, and fat. Blood sugar stability over a multi-hour session matters a lot. Drops in blood sugar can cause lightheadedness, nausea, and in some cases fainting.

Bring a snack for longer sessions — something with natural sugar (fruit, a cereal bar) for a mid-session boost.

### Wear the Right Clothes

Think about access to the area being tattooed:

- **Arm tattoo:** sleeveless top or loose short sleeves
- **Rib / side tattoo:** a loose top or one you can easily remove
- **Thigh / leg tattoo:** shorts or loose trousers you can roll up
- **Back tattoo:** a top that opens at the back, or a bikini/bralette

Wear something comfortable that you don't mind getting ink or cream on. Dark colours are practical.

### Skip the Numbing Cream Unless Discussed

Over-the-counter numbing creams exist (like EMLA) and can help with sensitive placements. However, some affect how the skin accepts ink. If you're interested, discuss it with your artist before your appointment — don't apply it without checking first. Showing up with numbing cream already on without telling anyone creates problems.

### Have a Shower

Arrive clean. This reduces bacteria on the skin surface and is just good etiquette toward your artist, who'll be working close to you for hours.

---

## At the Appointment

### Arrive on Time

Being late adds stress and can eat into your session time. Aim to arrive 5–10 minutes early.

### Review the Stencil Carefully

Before your artist starts, they'll apply a stencil of the design. Take time to look at it properly — placement, size, orientation. This is the moment to ask for adjustments. Once the tattoo starts, it's permanent. Don't rush this step.

### Communicate Throughout

Tell your artist if you need a break, if something feels wrong, or if you want to check the positioning as they go. Good artists appreciate clear communication. It helps them do their best work.

### Breathe Steadily

It sounds obvious, but it makes a real difference. When things get uncomfortable, focus on slow, deliberate exhales. It activates your parasympathetic nervous system and genuinely reduces pain perception.

### Don't Move Suddenly

If you need to shift position, warn your artist first. Sudden movement while the needle is in contact with your skin can smear lines or cause a slip. A quick "can I move a second?" is all you need.

### Take Breaks When Offered

Especially in longer sessions, your artist will likely offer breaks. Take them. Stand up, have your snack, drink some water, walk around. Your body and mind reset, and the remainder of the session will feel easier.

---

## Immediately After

### Listen to Your Artist's Aftercare Instructions

Every shop has slightly different aftercare protocols. Pay attention and ask if anything is unclear. Their instructions are based on how they wrap and seal the tattoo — follow them specifically, not something you read online later.

### Keep the Initial Wrap On

Most artists will wrap your tattoo in cling film or a specialised healing bandage (like Saniderm or Tegaderm). Follow their guidance on how long to leave it on. Don't peek early.

### Expect Some Soreness

The area will feel like a moderate sunburn for 24–48 hours. Some redness, warmth, and slight swelling is completely normal and will settle.

### Don't Judge the Tattoo Immediately

Fresh tattoos often look uneven, raised, or overly bright before they settle. The real tattoo reveals itself over 3–4 weeks of healing. Trust the process.

---

## Finding the Right Shop

If you haven't booked yet, browse reputable tattoo shops on [InkLink](/). You can filter by style, city, and whether a shop accepts first-timers or walk-ins. Reading reviews from other clients is the best way to find somewhere you'll feel comfortable for your first experience.
`,
  },

  // ─── 4. What Is Fine Line Tattooing? ───────────────────────────────────────
  {
    title: "What Is Fine Line Tattooing? Style Guide & What to Know Before You Book",
    slug: "what-is-fine-line-tattooing",
    excerpt:
      "Fine line tattoos have exploded in popularity — and for good reason. But they come with specific considerations around artist skill, longevity, and placement. Here's everything you need to know.",
    content: `# What Is Fine Line Tattooing? Style Guide & What to Know Before You Book

Fine line tattooing has become one of the most popular styles of the past decade, dominating Instagram feeds and celebrity skin alike. The style is characterised by delicate, precise linework — thin, intricate, and often minimalist. But there's a lot the aesthetic doesn't tell you. Here's the full picture before you book.

## What Is Fine Line Tattooing?

Fine line tattooing uses very thin needle groupings (typically a single needle or a tight 3-round liner) to create highly detailed, delicate designs with crisp, thin strokes. The result is an elegant, almost illustrative quality — far removed from the bold outlines of traditional tattoo styles.

Common fine line subjects include:

- Botanical illustrations (flowers, leaves, ferns)
- Minimalist geometric shapes
- Delicate portraits and faces
- Script and lettering
- Constellations and celestial imagery
- Thin-line mandalas and abstract patterns
- Fine-detail animal and bird illustrations

The style lends itself especially well to smaller pieces, though skilled artists execute large-scale fine line work too.

## Where Did Fine Line Tattooing Come From?

The modern fine line movement grew out of the LA tattoo scene in the early 2010s, pioneered by artists like Dr. Woo and JonBoy, whose celebrity clientele brought the style global attention. It has roots in the longer tradition of single-needle tattooing and prison-style fine line work, but the contemporary version pushed into higher-detail, more illustrative territory.

Social media accelerated its spread massively — fine line tattoos photograph beautifully and stood out sharply in feeds dominated by bolder work.

## What Makes a Good Fine Line Artist?

Not all tattoo artists can do fine line well, even if they're skilled in other styles. Fine line requires:

**Precision and a steady hand.** There's no bold outline to hide behind. Every stroke is visible, and a shaky line can't be corrected the way it can with bolder styles.

**Understanding of how thin lines heal.** Fine lines fade and blur faster than bold linework. A great fine line artist designs with longevity in mind — knowing which elements will hold up and which will need touch-ups.

**Experience with single or tight needle groupings.** The technical approach differs significantly from bold work. Artists who specialise in fine line have tuned their machine settings, needle depth, and technique specifically for it.

**A portfolio of healed work.** This is essential. Fresh fine line tattoos look stunning. Healed fine line tattoos tell the truth. Always ask to see healed examples before booking.

## Fine Line Tattooing and Longevity

This is the most important thing to understand about fine line: it doesn't age the same way as bold work.

Thin lines are more susceptible to:

- **Fading** — thinner deposits of ink break down faster with sun exposure and skin cell turnover
- **Blurring** — very fine lines can spread slightly under the skin over time, softening crisp edges
- **Ghosting** — in some cases, poorly executed fine line work almost disappears within a few years

This doesn't mean fine line is a bad choice — it means you need to:

1. **Choose a specialist.** An experienced fine line artist knows how to compensate for natural ageing in the design itself.
2. **Protect it from the sun.** UV exposure is the biggest enemy of fine line work. SPF on healed tattoos whenever they're exposed.
3. **Expect a touch-up.** Many fine line artists recommend a touch-up at 1–2 years to refresh any lines that have softened.
4. **Consider placement carefully.** Areas with more friction or movement (fingers, hands, inner elbows) will cause fine line work to fade faster.

## Best Placements for Fine Line

Fine line suits certain placements particularly well:

**Great placements:**
- Inner forearm and outer forearm
- Upper arm and shoulder
- Collarbone and chest
- Upper back
- Thigh (outer or inner)
- Behind the ear (small pieces)
- Ankle

**More challenging placements:**
- Fingers and hands — high friction, high fade rate
- Feet — similar issues
- Ribs — difficult surface to work on for fine line precision
- Inner wrist — frequent movement and sun exposure

## Fine Line vs. Minimalist: What's the Difference?

These terms are often used interchangeably, but they're not exactly the same:

- **Fine line** refers to the technical approach — thin needle, thin strokes
- **Minimalist** refers to the design philosophy — simplified shapes, negative space, restrained imagery

A tattoo can be both fine line and minimalist (a single thin-line fern), or fine line but not minimalist (a highly detailed botanical sleeve in thin linework). Understanding which you want helps you brief your artist accurately.

## What to Ask Before Booking

1. Can I see healed examples of your fine line work?
2. What's your recommended touch-up timeline?
3. Do you have placement recommendations for what I'm after?
4. What aftercare do you recommend for fine line specifically?
5. What size do you recommend for the detail level I want?

That last question matters. Very intricate designs that look great at A4 size don't always translate well to 3 inches on skin. A good artist will tell you honestly what will and won't work at your desired size.

## Finding a Fine Line Specialist

Use [InkLink](/) to search for tattoo shops and filter by style. Shops with fine line specialists will have it listed — and you can browse portfolios to find the aesthetic that matches your vision. Always book with someone whose healed portfolio you've already reviewed.
`,
  },

  // ─── 5. Tattoo Touch-Up Guide ───────────────────────────────────────────────
  {
    title: "Tattoo Touch-Ups: When You Need One, What to Expect & How Much It Costs",
    slug: "tattoo-touch-up-guide",
    excerpt:
      "Even great tattoos sometimes need a touch-up. Here's how to know when yours does, how to approach your artist about it, what the process involves, and whether you should expect to pay.",
    content: `# Tattoo Touch-Ups: When You Need One, What to Expect & How Much It Costs

Even the best tattoos sometimes need revisiting. Ink fades, lines soften, and healing doesn't always go perfectly. A touch-up can restore a tattoo to its original sharpness — or improve on it. Here's everything you need to know.

## What Is a Tattoo Touch-Up?

A touch-up is a follow-up session where your artist goes back over existing work to correct or refresh specific areas. This might mean:

- Re-inking lines that healed lighter than intended
- Adding colour saturation to areas that faded during healing
- Fixing a blowout or uneven patch
- Sharpening edges that softened over time
- Addressing missed spots (areas where ink didn't take)

Touch-ups are a normal part of the tattoo process — not a sign that anything went wrong.

## When Do You Need a Touch-Up?

### After Healing (1–3 Months)

The most common time for a touch-up is shortly after your tattoo has fully healed. Give it at least 6–8 weeks minimum — preferably 3 months — before assessing. Tattoos go through a lot during healing and can look patchy or dull before fully settling.

Signs you might need a post-healing touch-up:
- **Faded patches** — spots where ink didn't fully take during the original session
- **Uneven lines** — sections that healed lighter or thinner than the rest
- **Missing fill** — small gaps in shading or colour
- **Patchiness in colour** — especially common in white ink or very light colours

### After Significant Fading (Years Later)

Even well-done tattoos fade over time, especially with sun exposure. After several years you might want to refresh:
- Outlines that have softened
- Colours that have dulled
- Shading that's lost contrast

This is normal maintenance for tattoos you want to keep looking their best.

### Fine Line Tattoos Specifically

As discussed elsewhere on this blog, fine line work is more susceptible to fading than bold styles. A touch-up at 1–2 years is often recommended by fine line artists as part of the process, not an exception.

## When You Probably Don't Need One

**Before 6–8 weeks:** Too early. Your tattoo is still healing — what looks like a problem often isn't. Patience first.

**If it's minor natural ageing:** Slight softening of lines and subtle fading is normal over years. Not every tattoo needs constant refreshing.

**If aftercare wasn't followed:** If you picked, scratched, or exposed the tattoo to sun during healing and it healed badly, a touch-up can help — but be honest with your artist about what happened. The same issue can recur if aftercare isn't better managed.

## Is a Touch-Up Free?

This depends on the studio and the situation.

**Usually free:**
Most reputable artists offer one free touch-up within a set timeframe (commonly 3–6 months) if the issue is related to how the tattoo healed, not aftercare failure. Many studios state this policy upfront when you book.

**Usually not free:**
- If you didn't follow aftercare instructions and the tattoo healed poorly as a result
- If significant time has passed (typically over a year)
- If you want changes to the original design, not restoration of it
- If the touch-up is substantial — closer to a new session than a quick fix

**At a different studio:**
If you go to a different artist for a touch-up on another artist's work, you'll pay their standard rate. Some artists charge a premium for touching up someone else's tattoo.

## How to Ask Your Artist for a Touch-Up

Keep it straightforward. Message or email them with:
- A clear photo of the healed tattoo in good lighting
- A description of what looks off to you (faded area, uneven patch, etc.)
- Confirmation of when you got it done and that it's fully healed

Be collaborative, not accusatory. In most cases, artists want to stand behind their work and will be happy to fix any genuine issues. Approaching it as a partnership rather than a complaint gets better results.

## What to Expect at the Touch-Up Session

Touch-up sessions are generally shorter than the original — often 30 minutes to 1.5 hours depending on how much needs doing. The process is identical to the original tattoo: the artist goes over specific areas with a needle, depositing fresh ink.

Aftercare is the same as your original tattoo — treat it as a fresh wound, because that's exactly what it is.

## Touch-Up Costs (If Charged)

If your artist does charge for a touch-up, typical rates:

| Touch-Up Scope | Typical Cost |
|----------------|-------------|
| Minor fixes (under 30 min) | $50–$100 |
| Standard session (30–90 min) | $80–$150 |
| Substantial refresh | Hourly rate (same as new work) |

If you're going to a different artist for the work, expect to pay their standard hourly or flat rate.

## Preventing the Need for Frequent Touch-Ups

The best way to minimise touch-ups is proper aftercare and sun protection:

- **Follow your artist's aftercare instructions exactly** during healing
- **Don't pick or scratch** healing skin — this pulls out ink
- **Apply SPF 30+** to healed tattoos whenever they'll be in the sun
- **Moisturise regularly** — hydrated skin holds ink better long-term
- **Avoid prolonged sun exposure** to tattooed areas without protection

A well-cared-for tattoo in a low-friction placement can go many years looking sharp before needing any refresh.

## Finding the Right Artist for a Touch-Up

Whether you're returning to your original artist or looking for someone new, [InkLink](/) lets you browse shops by style and location. If you're touching up fine line work or detailed colour, look for someone who specialises in that style — especially for work that wasn't originally done by them.
`,
  },

  // ─── 6. Medical Questions / Getting a Tattoo While Pregnant, On Blood Thinners, etc. ──
  {
    title: "Can You Get a Tattoo While Pregnant, on Blood Thinners, or with a Skin Condition?",
    slug: "tattoo-medical-considerations",
    excerpt:
      "Pregnancy, blood thinners, diabetes, eczema, psoriasis — lots of medical factors affect whether getting a tattoo is safe. Here's what the evidence says and when to talk to your doctor first.",
    content: `# Can You Get a Tattoo While Pregnant, on Blood Thinners, or with a Skin Condition?

Medical questions about tattooing come up constantly, and for good reason — you're introducing ink under your skin with a needle. For most healthy adults it's low-risk when done at a reputable studio. But certain medical situations do change the calculation. Here's an honest breakdown of the most common questions.

> **Important:** This article is for general informational purposes. It is not medical advice. Always consult your doctor or healthcare provider before getting a tattoo if you have a relevant health condition.

---

## Can You Get a Tattoo While Pregnant?

**The general guidance: no — wait until after.**

There is no robust evidence that tattooing during pregnancy causes definite harm to a foetus. However, there are legitimate reasons why most medical professionals advise against it:

- **Infection risk:** Any time skin is broken there is a risk of infection. During pregnancy, infections are harder to treat (many antibiotics are off-limits) and can, in serious cases, affect the baby.
- **Bloodborne disease risk:** If the studio doesn't use sterile equipment, there is a theoretical risk of bloodborne diseases like hepatitis B, hepatitis C, or HIV — all of which can be transmitted to a foetus.
- **Unknown chemical risk:** The safety of tattoo inks and their metabolites during fetal development has not been well studied. Several ink pigments contain heavy metals and other compounds whose safety in pregnancy is unknown.
- **Skin changes:** Pregnancy causes skin to stretch and change significantly. Tattoos placed during pregnancy — especially on the abdomen — may heal differently or distort.
- **First trimester especially:** The first trimester is the most critical period of fetal development. The risk calculation is worst here.

**The practical answer:** Choose a reputable studio in any case, but ideally — wait. Your tattoo will be there when you're ready. The risk isn't worth it when the timeline can simply shift.

**What about numbing creams?** Many topical numbing agents are not recommended in pregnancy. Another reason to wait.

---

## Can You Get a Tattoo While Breastfeeding?

**Probably fine, but timing matters.**

The risk during breastfeeding is lower than during pregnancy. The concern is:

- **Ink particles:** Some small ink molecules can theoretically enter the bloodstream and breast milk, though the amounts are likely negligible.
- **Infection:** A skin infection while breastfeeding can occasionally complicate things, including in rare cases affecting the breast itself.

Most tattoo artists and many healthcare providers are comfortable with tattooing while breastfeeding, particularly if you're well past the newborn stage. Many recommend waiting until the baby is at least a few months old and breastfeeding is well established.

**If in doubt:** Have a conversation with your midwife or GP. It's a nuanced rather than a clear-cut no.

---

## Can You Get a Tattoo on Blood Thinners?

**Yes — but with caution and communication.**

Blood thinners (anticoagulants) include medications like warfarin, heparin, rivaroxaban, apixaban, dabigatran, and aspirin at higher doses. They reduce your blood's ability to clot.

What this means for tattooing:

- **More bleeding during the session:** The artist will need to wipe more frequently. This doesn't necessarily mean the tattoo won't work — but it's harder to execute precisely.
- **More ink pushed out:** Excess blood mixing with ink during application can dilute it and lead to patchier results.
- **Slower healing:** The wound takes longer to stop bleeding and begin healing, increasing infection risk.
- **Potential for bruising:** More likely around the tattooed area.

**What to do:**
1. Tell your tattoo artist before booking. Reputable artists will ask, and they need to know.
2. Talk to your prescribing doctor. In some cases, dosage can be temporarily adjusted around a planned procedure — but this must be medically supervised. Do not stop blood thinners without medical guidance.
3. Choose a simpler design. Highly detailed work is harder to execute cleanly with excess bleeding.

Blood thinners don't make tattooing impossible, but they require transparency with both your doctor and your artist.

---

## Can You Get a Tattoo with Diabetes?

**Often yes — with additional care.**

Diabetes (both Type 1 and Type 2) affects wound healing and immune response. This is the core concern with tattooing:

- **Slower healing:** Elevated blood sugar impairs the body's ability to repair skin efficiently
- **Higher infection risk:** Reduced immune function means infections are more likely and can be harder to clear
- **Peripheral neuropathy:** If you have reduced sensation in certain areas (common with long-term diabetes), you may not notice early signs of infection in a tattooed limb

**What helps:**
- Well-controlled blood sugar before, during, and after the appointment
- Avoiding tattooing on areas with poor circulation (feet and lower legs are higher risk for diabetics)
- Working with a reputable, clean studio with proper sterilisation
- Close monitoring of the tattooed area during healing
- Checking with your endocrinologist or GP first if your diabetes is not well controlled

Many people with well-managed diabetes get tattoos without issues. Control and communication are the key variables.

---

## Can You Get a Tattoo with Eczema?

**It depends on severity and current state.**

Eczema (atopic dermatitis) creates challenges because:

- **Active flares:** Getting tattooed on actively inflamed, broken, or irritated skin is a bad idea. The area needs to be in a stable, clear state.
- **Koebner phenomenon:** Some eczema sufferers experience a response where new skin trauma triggers eczema to develop in that area. This can affect how a tattoo heals.
- **Sensitive skin:** Eczema skin tends to be more reactive, which can complicate healing

**If you have eczema:**
- Wait for a clear, stable period — ideally several months without a flare on the target area
- Avoid areas that regularly flare for you
- Talk to a dermatologist if your eczema is severe or unpredictable
- Choose a reputable artist and disclose your condition — they may have experience tattooing clients with eczema

Mild, well-managed eczema doesn't preclude tattooing. Severe or frequently flaring eczema is a different conversation.

---

## Can You Get a Tattoo with Psoriasis?

**Similar to eczema — proceed carefully.**

Psoriasis also carries a risk of the Koebner phenomenon, where skin trauma triggers psoriatic plaques to form at the trauma site — including the tattooed area. This is a real risk, not a theoretical one.

Additionally:
- Tattooing over an existing psoriatic plaque produces poor results and should be avoided
- Psoriasis medications (especially immunosuppressants like methotrexate, biologics) can affect healing and infection risk

Consult a dermatologist before booking if you have psoriasis. Some people with mild psoriasis tattoo without issues; others experience significant complications.

---

## Can You Get a Tattoo on Accutane (Isotretinoin)?

**No — wait until you're finished.**

Accutane (isotretinoin) is a powerful acne medication that significantly affects skin. While on it:

- Skin is far more sensitive and prone to scarring
- Healing is impaired
- Scarring risk is elevated

Most dermatologists and tattoo artists recommend waiting at least 6 months after finishing Accutane before getting tattooed. Some say a full year to be safe.

---

## General Principles

Whatever your medical situation, a few things always apply:

1. **Be honest with your tattoo artist.** They ask about health conditions for a reason. Withholding relevant information puts you at unnecessary risk.
2. **Talk to your doctor first** if you have any condition that affects immune function, wound healing, or blood clotting.
3. **Choose a reputable, licensed studio** with proper sterilisation practices. This reduces the baseline risk for everyone but matters even more when health factors are in play.
4. **Don't rush.** If timing means waiting six months or a year, the tattoo will still be there.

Browse verified tattoo shops on [InkLink](/) — finding a studio with strong reviews and confirmed licensing is a good starting point for anyone navigating medical questions around tattooing.
`,
  },
];

async function main() {
  const p = new PrismaClient({ datasources: { db: { url: DB } } });

  for (const post of posts) {
    const existing = await p.$queryRaw<{ id: number }[]>`
      SELECT id FROM "BlogPost" WHERE slug = ${post.slug} LIMIT 1
    `;

    if (existing.length > 0) {
      console.log(`  SKIP     "${post.title}" — slug already exists`);
      continue;
    }

    await p.$queryRaw`
      INSERT INTO "BlogPost" (title, slug, excerpt, content, "authorId", status, "publishedAt", "viewCount", "createdAt", "updatedAt")
      VALUES (
        ${post.title},
        ${post.slug},
        ${post.excerpt},
        ${post.content},
        ${AUTHOR_ID},
        'published',
        NOW(),
        0,
        NOW(),
        NOW()
      )
    `;
    console.log(`  CREATED  "${post.title}"`);
  }

  await p.$disconnect();
  console.log("\nDone.");
}

main();
