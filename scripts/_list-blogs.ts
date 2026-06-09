import { PrismaClient } from "@prisma/client";

const DB = process.env.DATABASE_URL;
if (!DB) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

async function main() {
  const p = new PrismaClient({ datasources: { db: { url: DB } } });
  const rows = await p.$queryRaw<{ id: number; title: string; status: string }[]>`
    SELECT id, title, status FROM "BlogPost" ORDER BY id ASC
  `;
  rows.forEach((x) => console.log(`${x.id} | ${x.status} | ${x.title}`));
  await p.$disconnect();
}

main();
