import { PrismaClient } from "@prisma/client";

const DB = "postgresql://postgres:Xw6L8ShlDMVDa62TdMKiogkxhNvKNCQO@switchyard.proxy.rlwy.net:19608/railway";

async function main() {
  const p = new PrismaClient({ datasources: { db: { url: DB } } });
  const rows = await p.$queryRaw<{ id: number; title: string; status: string }[]>`
    SELECT id, title, status FROM "BlogPost" ORDER BY id ASC
  `;
  rows.forEach((x) => console.log(`${x.id} | ${x.status} | ${x.title}`));
  await p.$disconnect();
}

main();
