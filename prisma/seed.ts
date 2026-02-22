import { PrismaClient, ListingType, PriceRange, ListingStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ── Cleanup removed categories ────────────────────────
  const removedSlugs = ["color-specialist", "black-and-grey", "custom-design", "tattoo-supplies", "aftercare-products"];
  await prisma.listingCategory.deleteMany({
    where: { category: { slug: { in: removedSlugs } } },
  });
  await prisma.category.deleteMany({
    where: { slug: { in: removedSlugs } },
  });
  console.log("Cleaned up removed categories");

  // ── Categories ──────────────────────────────────────────
  const categories = [
    // Tattoo styles
    { name: "Traditional", slug: "traditional", description: "Bold lines, bright colors, and classic Americana designs", type: "shop" as ListingType, icon: "⚓", sortOrder: 1 },
    { name: "Neo-Traditional", slug: "neo-traditional", description: "Modern twist on traditional with more detail and color range", type: "shop" as ListingType, icon: "🌹", sortOrder: 2 },
    { name: "Realism", slug: "realism", description: "Photorealistic portraits and lifelike imagery", type: "shop" as ListingType, icon: "📷", sortOrder: 3 },
    { name: "Japanese", slug: "japanese", description: "Irezumi style with koi, dragons, and traditional Japanese motifs", type: "shop" as ListingType, icon: "🐉", sortOrder: 4 },
    { name: "Blackwork", slug: "blackwork", description: "Bold black ink designs, geometric patterns, and heavy coverage", type: "shop" as ListingType, icon: "⬛", sortOrder: 5 },
    { name: "Watercolor", slug: "watercolor", description: "Painterly style with splashes of color and soft edges", type: "shop" as ListingType, icon: "🎨", sortOrder: 6 },
    { name: "Fine Line", slug: "fine-line", description: "Delicate, thin-line work with intricate detail", type: "shop" as ListingType, icon: "✨", sortOrder: 7 },
    { name: "Tribal", slug: "tribal", description: "Bold black patterns inspired by Polynesian and indigenous cultures", type: "shop" as ListingType, icon: "🔱", sortOrder: 8 },
    { name: "Geometric", slug: "geometric", description: "Sacred geometry, mandalas, and mathematical patterns", type: "shop" as ListingType, icon: "🔷", sortOrder: 9 },
    { name: "Minimalist", slug: "minimalist", description: "Simple, clean designs with minimal detail", type: "shop" as ListingType, icon: "◽", sortOrder: 10 },
    { name: "Dotwork", slug: "dotwork", description: "Intricate designs created entirely from individual dots", type: "shop" as ListingType, icon: "⚪", sortOrder: 11 },
    { name: "Chicano", slug: "chicano", description: "Black and grey style rooted in Mexican-American culture", type: "shop" as ListingType, icon: "🙏", sortOrder: 12 },
    { name: "Illustrative", slug: "illustrative", description: "Drawing and illustration-inspired tattoo designs", type: "shop" as ListingType, icon: "✏️", sortOrder: 13 },
    { name: "Script & Lettering", slug: "script-lettering", description: "Custom lettering, quotes, and calligraphy tattoos", type: "shop" as ListingType, icon: "📝", sortOrder: 14 },
    { name: "Trash Polka", slug: "trash-polka", description: "Red and black collage style mixing realism and abstract", type: "shop" as ListingType, icon: "🔴", sortOrder: 15 },
    { name: "New School", slug: "new-school", description: "Cartoon-like, exaggerated, and colorful designs", type: "shop" as ListingType, icon: "🎭", sortOrder: 16 },
    { name: "Surrealism", slug: "surrealism", description: "Dreamlike and abstract artistic tattoo designs", type: "shop" as ListingType, icon: "🌀", sortOrder: 17 },
    { name: "Cover-Up", slug: "cover-up", description: "Specialists in covering or reworking existing tattoos", type: "shop" as ListingType, icon: "🔄", sortOrder: 18 },
    { name: "Portrait", slug: "portrait", description: "Realistic portraits of people and pets", type: "shop" as ListingType, icon: "🖼️", sortOrder: 19 },
    { name: "Biomechanical", slug: "biomechanical", description: "Mechanical and organic fusion designs beneath the skin", type: "shop" as ListingType, icon: "⚙️", sortOrder: 20 },
    // Artist specializations
    { name: "Flash Tattoos", slug: "flash-tattoos", description: "Pre-designed tattoo art available for walk-ins", type: "artist" as ListingType, icon: "⚡", sortOrder: 21 },
    // Service categories
    { name: "Tattoo Removal", slug: "tattoo-removal", description: "Laser removal and fading services", type: "supplier" as ListingType, icon: "❌", sortOrder: 22 },
    { name: "Piercing Studio", slug: "piercing-studio", description: "Body piercing services and jewelry", type: "supplier" as ListingType, icon: "💎", sortOrder: 23 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log(`Seeded ${categories.length} categories`);

  // ── States ──────────────────────────────────────────────
  const states = [
    { name: "Alabama", abbreviation: "AL", slug: "alabama" },
    { name: "Alaska", abbreviation: "AK", slug: "alaska" },
    { name: "Arizona", abbreviation: "AZ", slug: "arizona" },
    { name: "Arkansas", abbreviation: "AR", slug: "arkansas" },
    { name: "California", abbreviation: "CA", slug: "california" },
    { name: "Colorado", abbreviation: "CO", slug: "colorado" },
    { name: "Connecticut", abbreviation: "CT", slug: "connecticut" },
    { name: "Delaware", abbreviation: "DE", slug: "delaware" },
    { name: "Florida", abbreviation: "FL", slug: "florida" },
    { name: "Georgia", abbreviation: "GA", slug: "georgia" },
    { name: "Hawaii", abbreviation: "HI", slug: "hawaii" },
    { name: "Idaho", abbreviation: "ID", slug: "idaho" },
    { name: "Illinois", abbreviation: "IL", slug: "illinois" },
    { name: "Indiana", abbreviation: "IN", slug: "indiana" },
    { name: "Iowa", abbreviation: "IA", slug: "iowa" },
    { name: "Kansas", abbreviation: "KS", slug: "kansas" },
    { name: "Kentucky", abbreviation: "KY", slug: "kentucky" },
    { name: "Louisiana", abbreviation: "LA", slug: "louisiana" },
    { name: "Maine", abbreviation: "ME", slug: "maine" },
    { name: "Maryland", abbreviation: "MD", slug: "maryland" },
    { name: "Massachusetts", abbreviation: "MA", slug: "massachusetts" },
    { name: "Michigan", abbreviation: "MI", slug: "michigan" },
    { name: "Minnesota", abbreviation: "MN", slug: "minnesota" },
    { name: "Mississippi", abbreviation: "MS", slug: "mississippi" },
    { name: "Missouri", abbreviation: "MO", slug: "missouri" },
    { name: "Montana", abbreviation: "MT", slug: "montana" },
    { name: "Nebraska", abbreviation: "NE", slug: "nebraska" },
    { name: "Nevada", abbreviation: "NV", slug: "nevada" },
    { name: "New Hampshire", abbreviation: "NH", slug: "new-hampshire" },
    { name: "New Jersey", abbreviation: "NJ", slug: "new-jersey" },
    { name: "New Mexico", abbreviation: "NM", slug: "new-mexico" },
    { name: "New York", abbreviation: "NY", slug: "new-york" },
    { name: "North Carolina", abbreviation: "NC", slug: "north-carolina" },
    { name: "North Dakota", abbreviation: "ND", slug: "north-dakota" },
    { name: "Ohio", abbreviation: "OH", slug: "ohio" },
    { name: "Oklahoma", abbreviation: "OK", slug: "oklahoma" },
    { name: "Oregon", abbreviation: "OR", slug: "oregon" },
    { name: "Pennsylvania", abbreviation: "PA", slug: "pennsylvania" },
    { name: "Rhode Island", abbreviation: "RI", slug: "rhode-island" },
    { name: "South Carolina", abbreviation: "SC", slug: "south-carolina" },
    { name: "South Dakota", abbreviation: "SD", slug: "south-dakota" },
    { name: "Tennessee", abbreviation: "TN", slug: "tennessee" },
    { name: "Texas", abbreviation: "TX", slug: "texas" },
    { name: "Utah", abbreviation: "UT", slug: "utah" },
    { name: "Vermont", abbreviation: "VT", slug: "vermont" },
    { name: "Virginia", abbreviation: "VA", slug: "virginia" },
    { name: "Washington", abbreviation: "WA", slug: "washington" },
    { name: "West Virginia", abbreviation: "WV", slug: "west-virginia" },
    { name: "Wisconsin", abbreviation: "WI", slug: "wisconsin" },
    { name: "Wyoming", abbreviation: "WY", slug: "wyoming" },
  ];

  for (const state of states) {
    await prisma.state.upsert({
      where: { abbreviation: state.abbreviation },
      update: state,
      create: state,
    });
  }
  console.log(`Seeded ${states.length} states`);

  // ── Cities (top 100 US metros) ──────────────────────────
  const stateMap = new Map<string, number>();
  const allStates = await prisma.state.findMany();
  for (const s of allStates) stateMap.set(s.abbreviation, s.id);

  const cities = [
    { name: "New York", slug: "new-york", state: "NY", population: 8336817, latitude: 40.7128, longitude: -74.0060, metroArea: "New York-Newark" },
    { name: "Los Angeles", slug: "los-angeles", state: "CA", population: 3979576, latitude: 34.0522, longitude: -118.2437, metroArea: "Los Angeles-Long Beach" },
    { name: "Chicago", slug: "chicago", state: "IL", population: 2693976, latitude: 41.8781, longitude: -87.6298, metroArea: "Chicago-Naperville" },
    { name: "Houston", slug: "houston", state: "TX", population: 2320268, latitude: 29.7604, longitude: -95.3698, metroArea: "Houston-The Woodlands" },
    { name: "Phoenix", slug: "phoenix", state: "AZ", population: 1680992, latitude: 33.4484, longitude: -112.0740, metroArea: "Phoenix-Mesa" },
    { name: "Philadelphia", slug: "philadelphia", state: "PA", population: 1603797, latitude: 39.9526, longitude: -75.1652, metroArea: "Philadelphia-Camden" },
    { name: "San Antonio", slug: "san-antonio", state: "TX", population: 1547253, latitude: 29.4241, longitude: -98.4936, metroArea: "San Antonio-New Braunfels" },
    { name: "San Diego", slug: "san-diego", state: "CA", population: 1423851, latitude: 32.7157, longitude: -117.1611, metroArea: "San Diego-Chula Vista" },
    { name: "Dallas", slug: "dallas", state: "TX", population: 1343573, latitude: 32.7767, longitude: -96.7970, metroArea: "Dallas-Fort Worth" },
    { name: "San Jose", slug: "san-jose", state: "CA", population: 1021795, latitude: 37.3382, longitude: -121.8863, metroArea: "San Jose-Sunnyvale" },
    { name: "Austin", slug: "austin", state: "TX", population: 978908, latitude: 30.2672, longitude: -97.7431, metroArea: "Austin-Round Rock" },
    { name: "Jacksonville", slug: "jacksonville", state: "FL", population: 949611, latitude: 30.3322, longitude: -81.6557, metroArea: "Jacksonville" },
    { name: "Fort Worth", slug: "fort-worth", state: "TX", population: 918915, latitude: 32.7555, longitude: -97.3308, metroArea: "Dallas-Fort Worth" },
    { name: "Columbus", slug: "columbus", state: "OH", population: 905748, latitude: 39.9612, longitude: -82.9988, metroArea: "Columbus" },
    { name: "Charlotte", slug: "charlotte", state: "NC", population: 874579, latitude: 35.2271, longitude: -80.8431, metroArea: "Charlotte-Concord" },
    { name: "Indianapolis", slug: "indianapolis", state: "IN", population: 867125, latitude: 39.7684, longitude: -86.1581, metroArea: "Indianapolis-Carmel" },
    { name: "San Francisco", slug: "san-francisco", state: "CA", population: 873965, latitude: 37.7749, longitude: -122.4194, metroArea: "San Francisco-Oakland" },
    { name: "Seattle", slug: "seattle", state: "WA", population: 737015, latitude: 47.6062, longitude: -122.3321, metroArea: "Seattle-Tacoma" },
    { name: "Denver", slug: "denver", state: "CO", population: 715522, latitude: 39.7392, longitude: -104.9903, metroArea: "Denver-Aurora" },
    { name: "Nashville", slug: "nashville", state: "TN", population: 689447, latitude: 36.1627, longitude: -86.7816, metroArea: "Nashville-Davidson" },
    { name: "Oklahoma City", slug: "oklahoma-city", state: "OK", population: 681054, latitude: 35.4676, longitude: -97.5164, metroArea: "Oklahoma City" },
    { name: "El Paso", slug: "el-paso", state: "TX", population: 678815, latitude: 31.7619, longitude: -106.4850, metroArea: "El Paso" },
    { name: "Washington", slug: "washington", state: "VA", population: 689545, latitude: 38.9072, longitude: -77.0369, metroArea: "Washington-Arlington" },
    { name: "Boston", slug: "boston", state: "MA", population: 694583, latitude: 42.3601, longitude: -71.0589, metroArea: "Boston-Cambridge" },
    { name: "Las Vegas", slug: "las-vegas", state: "NV", population: 641903, latitude: 36.1699, longitude: -115.1398, metroArea: "Las Vegas-Henderson" },
    { name: "Portland", slug: "portland", state: "OR", population: 652503, latitude: 45.5152, longitude: -122.6784, metroArea: "Portland-Vancouver" },
    { name: "Memphis", slug: "memphis", state: "TN", population: 633104, latitude: 35.1495, longitude: -90.0490, metroArea: "Memphis" },
    { name: "Louisville", slug: "louisville", state: "KY", population: 633045, latitude: 38.2527, longitude: -85.7585, metroArea: "Louisville-Jefferson" },
    { name: "Baltimore", slug: "baltimore", state: "MD", population: 585708, latitude: 39.2904, longitude: -76.6122, metroArea: "Baltimore-Columbia" },
    { name: "Milwaukee", slug: "milwaukee", state: "WI", population: 577222, latitude: 43.0389, longitude: -87.9065, metroArea: "Milwaukee-Waukesha" },
    { name: "Albuquerque", slug: "albuquerque", state: "NM", population: 564559, latitude: 35.0844, longitude: -106.6504, metroArea: "Albuquerque" },
    { name: "Tucson", slug: "tucson", state: "AZ", population: 542629, latitude: 32.2226, longitude: -110.9747, metroArea: "Tucson" },
    { name: "Fresno", slug: "fresno", state: "CA", population: 542107, latitude: 36.7378, longitude: -119.7871, metroArea: "Fresno" },
    { name: "Sacramento", slug: "sacramento", state: "CA", population: 524943, latitude: 38.5816, longitude: -121.4944, metroArea: "Sacramento-Roseville" },
    { name: "Mesa", slug: "mesa", state: "AZ", population: 504258, latitude: 33.4152, longitude: -111.8315, metroArea: "Phoenix-Mesa" },
    { name: "Kansas City", slug: "kansas-city", state: "MO", population: 508090, latitude: 39.0997, longitude: -94.5786, metroArea: "Kansas City" },
    { name: "Atlanta", slug: "atlanta", state: "GA", population: 498715, latitude: 33.7490, longitude: -84.3880, metroArea: "Atlanta-Sandy Springs" },
    { name: "Omaha", slug: "omaha", state: "NE", population: 486051, latitude: 41.2565, longitude: -95.9345, metroArea: "Omaha-Council Bluffs" },
    { name: "Colorado Springs", slug: "colorado-springs", state: "CO", population: 478961, latitude: 38.8339, longitude: -104.8214, metroArea: "Colorado Springs" },
    { name: "Raleigh", slug: "raleigh", state: "NC", population: 467665, latitude: 35.7796, longitude: -78.6382, metroArea: "Raleigh-Cary" },
    { name: "Long Beach", slug: "long-beach", state: "CA", population: 466742, latitude: 33.7701, longitude: -118.1937, metroArea: "Los Angeles-Long Beach" },
    { name: "Virginia Beach", slug: "virginia-beach", state: "VA", population: 459470, latitude: 36.8529, longitude: -75.9780, metroArea: "Virginia Beach-Norfolk" },
    { name: "Miami", slug: "miami", state: "FL", population: 442241, latitude: 25.7617, longitude: -80.1918, metroArea: "Miami-Fort Lauderdale" },
    { name: "Oakland", slug: "oakland", state: "CA", population: 433031, latitude: 37.8044, longitude: -122.2712, metroArea: "San Francisco-Oakland" },
    { name: "Minneapolis", slug: "minneapolis", state: "MN", population: 429954, latitude: 44.9778, longitude: -93.2650, metroArea: "Minneapolis-St. Paul" },
    { name: "Tampa", slug: "tampa", state: "FL", population: 384959, latitude: 27.9506, longitude: -82.4572, metroArea: "Tampa-St. Petersburg" },
    { name: "Tulsa", slug: "tulsa", state: "OK", population: 413066, latitude: 36.1540, longitude: -95.9928, metroArea: "Tulsa" },
    { name: "Arlington", slug: "arlington", state: "TX", population: 394266, latitude: 32.7357, longitude: -97.1081, metroArea: "Dallas-Fort Worth" },
    { name: "New Orleans", slug: "new-orleans", state: "LA", population: 383997, latitude: 29.9511, longitude: -90.0715, metroArea: "New Orleans-Metairie" },
    { name: "Wichita", slug: "wichita", state: "KS", population: 397532, latitude: 37.6872, longitude: -97.3301, metroArea: "Wichita" },
    { name: "Cleveland", slug: "cleveland", state: "OH", population: 372624, latitude: 41.4993, longitude: -81.6944, metroArea: "Cleveland-Elyria" },
    { name: "Bakersfield", slug: "bakersfield", state: "CA", population: 403455, latitude: 35.3733, longitude: -119.0187, metroArea: "Bakersfield" },
    { name: "Aurora", slug: "aurora", state: "CO", population: 386261, latitude: 39.7294, longitude: -104.8319, metroArea: "Denver-Aurora" },
    { name: "Anaheim", slug: "anaheim", state: "CA", population: 350365, latitude: 33.8366, longitude: -117.9143, metroArea: "Los Angeles-Long Beach" },
    { name: "Honolulu", slug: "honolulu", state: "HI", population: 350964, latitude: 21.3069, longitude: -157.8583, metroArea: "Honolulu" },
    { name: "Santa Ana", slug: "santa-ana", state: "CA", population: 309441, latitude: 33.7455, longitude: -117.8677, metroArea: "Los Angeles-Long Beach" },
    { name: "Riverside", slug: "riverside", state: "CA", population: 314998, latitude: 33.9806, longitude: -117.3755, metroArea: "Riverside-San Bernardino" },
    { name: "Corpus Christi", slug: "corpus-christi", state: "TX", population: 317863, latitude: 27.8006, longitude: -97.3964, metroArea: "Corpus Christi" },
    { name: "Lexington", slug: "lexington", state: "KY", population: 322570, latitude: 38.0406, longitude: -84.5037, metroArea: "Lexington-Fayette" },
    { name: "Pittsburgh", slug: "pittsburgh", state: "PA", population: 302971, latitude: 40.4406, longitude: -79.9959, metroArea: "Pittsburgh" },
    { name: "Anchorage", slug: "anchorage", state: "AK", population: 291247, latitude: 61.2181, longitude: -149.9003, metroArea: "Anchorage" },
    { name: "Stockton", slug: "stockton", state: "CA", population: 320804, latitude: 37.9577, longitude: -121.2908, metroArea: "Stockton" },
    { name: "Cincinnati", slug: "cincinnati", state: "OH", population: 309317, latitude: 39.1031, longitude: -84.5120, metroArea: "Cincinnati" },
    { name: "St. Paul", slug: "st-paul", state: "MN", population: 311527, latitude: 44.9537, longitude: -93.0900, metroArea: "Minneapolis-St. Paul" },
    { name: "Greensboro", slug: "greensboro", state: "NC", population: 299035, latitude: 36.0726, longitude: -79.7920, metroArea: "Greensboro-High Point" },
    { name: "Toledo", slug: "toledo", state: "OH", population: 270871, latitude: 41.6528, longitude: -83.5379, metroArea: "Toledo" },
    { name: "Newark", slug: "newark", state: "NJ", population: 311549, latitude: 40.7357, longitude: -74.1724, metroArea: "New York-Newark" },
    { name: "Plano", slug: "plano", state: "TX", population: 285494, latitude: 33.0198, longitude: -96.6989, metroArea: "Dallas-Fort Worth" },
    { name: "Henderson", slug: "henderson", state: "NV", population: 320189, latitude: 36.0395, longitude: -114.9817, metroArea: "Las Vegas-Henderson" },
    { name: "Lincoln", slug: "lincoln", state: "NE", population: 291082, latitude: 40.8136, longitude: -96.7026, metroArea: "Lincoln" },
    { name: "Orlando", slug: "orlando", state: "FL", population: 307573, latitude: 28.5383, longitude: -81.3792, metroArea: "Orlando-Kissimmee" },
    { name: "Buffalo", slug: "buffalo", state: "NY", population: 278349, latitude: 42.8864, longitude: -78.8784, metroArea: "Buffalo-Niagara Falls" },
    { name: "Jersey City", slug: "jersey-city", state: "NJ", population: 292449, latitude: 40.7282, longitude: -74.0776, metroArea: "New York-Newark" },
    { name: "Chula Vista", slug: "chula-vista", state: "CA", population: 275487, latitude: 32.6401, longitude: -117.0842, metroArea: "San Diego-Chula Vista" },
    { name: "Norfolk", slug: "norfolk", state: "VA", population: 238005, latitude: 36.8508, longitude: -76.2859, metroArea: "Virginia Beach-Norfolk" },
    { name: "Chandler", slug: "chandler", state: "AZ", population: 275987, latitude: 33.3062, longitude: -111.8413, metroArea: "Phoenix-Mesa" },
    { name: "St. Petersburg", slug: "st-petersburg", state: "FL", population: 258308, latitude: 27.7676, longitude: -82.6403, metroArea: "Tampa-St. Petersburg" },
    { name: "Laredo", slug: "laredo", state: "TX", population: 255205, latitude: 27.5036, longitude: -99.5076, metroArea: "Laredo" },
    { name: "Madison", slug: "madison", state: "WI", population: 269840, latitude: 43.0731, longitude: -89.4012, metroArea: "Madison" },
    { name: "Gilbert", slug: "gilbert", state: "AZ", population: 267918, latitude: 33.3528, longitude: -111.7890, metroArea: "Phoenix-Mesa" },
    { name: "Reno", slug: "reno", state: "NV", population: 264165, latitude: 39.5296, longitude: -119.8138, metroArea: "Reno" },
    { name: "Detroit", slug: "detroit", state: "MI", population: 639111, latitude: 42.3314, longitude: -83.0458, metroArea: "Detroit-Warren" },
    { name: "Salt Lake City", slug: "salt-lake-city", state: "UT", population: 199723, latitude: 40.7608, longitude: -111.8910, metroArea: "Salt Lake City" },
    { name: "Boise", slug: "boise", state: "ID", population: 235684, latitude: 43.6150, longitude: -116.2023, metroArea: "Boise City" },
    { name: "Richmond", slug: "richmond", state: "VA", population: 226610, latitude: 37.5407, longitude: -77.4360, metroArea: "Richmond" },
    { name: "Des Moines", slug: "des-moines", state: "IA", population: 214237, latitude: 41.5868, longitude: -93.6250, metroArea: "Des Moines-West Des Moines" },
    { name: "Spokane", slug: "spokane", state: "WA", population: 228989, latitude: 47.6588, longitude: -117.4260, metroArea: "Spokane-Spokane Valley" },
    { name: "Birmingham", slug: "birmingham", state: "AL", population: 200733, latitude: 33.5207, longitude: -86.8025, metroArea: "Birmingham-Hoover" },
    { name: "Rochester", slug: "rochester", state: "NY", population: 211328, latitude: 43.1566, longitude: -77.6088, metroArea: "Rochester" },
    { name: "Baton Rouge", slug: "baton-rouge", state: "LA", population: 227470, latitude: 30.4515, longitude: -91.1871, metroArea: "Baton Rouge" },
    { name: "Tacoma", slug: "tacoma", state: "WA", population: 219346, latitude: 47.2529, longitude: -122.4443, metroArea: "Seattle-Tacoma" },
    { name: "Savannah", slug: "savannah", state: "GA", population: 147780, latitude: 32.0809, longitude: -81.0912, metroArea: "Savannah" },
    { name: "Charleston", slug: "charleston", state: "SC", population: 150227, latitude: 32.7765, longitude: -79.9311, metroArea: "Charleston-North Charleston" },
    { name: "Providence", slug: "providence", state: "RI", population: 190934, latitude: 41.8240, longitude: -71.4128, metroArea: "Providence-Warwick" },
    { name: "Little Rock", slug: "little-rock", state: "AR", population: 202591, latitude: 34.7465, longitude: -92.2896, metroArea: "Little Rock-North Little Rock" },
    { name: "Jackson", slug: "jackson", state: "MS", population: 153701, latitude: 32.2988, longitude: -90.1848, metroArea: "Jackson" },
    { name: "Hartford", slug: "hartford", state: "CT", population: 121054, latitude: 41.7658, longitude: -72.6734, metroArea: "Hartford-East Hartford" },
    { name: "Wilmington", slug: "wilmington", state: "DE", population: 70898, latitude: 39.7391, longitude: -75.5398, metroArea: "Wilmington" },
    { name: "Manchester", slug: "manchester", state: "NH", population: 115644, latitude: 42.9956, longitude: -71.4548, metroArea: "Manchester-Nashua" },
    { name: "Portland", slug: "portland", state: "ME", population: 68408, latitude: 43.6591, longitude: -70.2568, metroArea: "Portland-South Portland" },
    { name: "Burlington", slug: "burlington", state: "VT", population: 44743, latitude: 44.4759, longitude: -73.2121, metroArea: "Burlington-South Burlington" },
    { name: "Billings", slug: "billings", state: "MT", population: 119510, latitude: 45.7833, longitude: -108.5007, metroArea: "Billings" },
    { name: "Cheyenne", slug: "cheyenne", state: "WY", population: 65132, latitude: 41.1400, longitude: -104.8202, metroArea: "Cheyenne" },
    { name: "Sioux Falls", slug: "sioux-falls", state: "SD", population: 192517, latitude: 43.5446, longitude: -96.7311, metroArea: "Sioux Falls" },
    { name: "Fargo", slug: "fargo", state: "ND", population: 125990, latitude: 46.8772, longitude: -96.7898, metroArea: "Fargo" },
    { name: "Charleston", slug: "charleston", state: "WV", population: 48006, latitude: 38.3498, longitude: -81.6326, metroArea: "Charleston" },
  ];

  for (const city of cities) {
    const stateId = stateMap.get(city.state);
    if (!stateId) continue;
    await prisma.city.upsert({
      where: { slug_stateId: { slug: city.slug, stateId } },
      update: {
        name: city.name,
        population: city.population,
        latitude: city.latitude,
        longitude: city.longitude,
        metroArea: city.metroArea,
      },
      create: {
        name: city.name,
        slug: city.slug,
        stateId,
        population: city.population,
        latitude: city.latitude,
        longitude: city.longitude,
        metroArea: city.metroArea,
      },
    });
  }
  console.log(`Seeded ${cities.length} cities`);

  // ── Admin Users ────────────────────────────────────────
  // Set ADMIN_EMAILS as a comma-separated list in your environment variables
  const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  for (const email of ADMIN_EMAILS) {
    // If user already exists (e.g. registered normally), promote to admin
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      await prisma.user.update({
        where: { email },
        data: { role: "admin" },
      });
      console.log(`Promoted existing user to admin: ${email}`);
    } else {
      // Create admin account — ADMIN_PASSWORD env var is required
      const adminPassword = process.env.ADMIN_PASSWORD;
      if (!adminPassword) {
        console.warn(`Skipping admin creation for ${email}: ADMIN_PASSWORD env var not set`);
        continue;
      }
      const adminHash = await bcrypt.hash(adminPassword, 12);
      await prisma.user.create({
        data: {
          email,
          name: "Admin",
          passwordHash: adminHash,
          role: "admin",
        },
      });
      console.log(`Created admin user: ${email}`);
    }
  }

  console.log("Seeding complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
