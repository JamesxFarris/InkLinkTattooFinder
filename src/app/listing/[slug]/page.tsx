import { notFound, permanentRedirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { listingUrl } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export default async function OldListingRedirect({ params }: Props) {
  const { slug } = await params;

  const listing = await prisma.listing.findUnique({
    where: { slug },
    select: {
      slug: true,
      city: { select: { slug: true, state: { select: { slug: true } } } },
    },
  });

  if (!listing) notFound();

  permanentRedirect(listingUrl(listing));
}
