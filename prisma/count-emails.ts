import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();

async function main() {
  const total = await p.listing.count({ where: { status: "active" } });
  const withEmail = await p.listing.count({ where: { status: "active", email: { not: null } } });
  const emptyEmail = await p.listing.count({ where: { status: "active", email: "" } });
  const noEmail = total - withEmail + emptyEmail;
  const withIGnoEmail = await p.listing.count({
    where: { status: "active", instagramUrl: { not: null }, OR: [{ email: null }, { email: "" }] },
  });
  console.log("Total active:", total);
  console.log("With email:", withEmail - emptyEmail);
  console.log("Without email:", noEmail);
  console.log("Have IG but no email:", withIGnoEmail);
  await p.$disconnect();
}
main();
