import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { auditLog } from "@/lib/audit";
import type Stripe from "stripe";

function getSubscriptionPeriodEnd(subscription: Stripe.Subscription): Date | null {
  const item = subscription.items?.data?.[0];
  if (item?.current_period_end) {
    return new Date(item.current_period_end * 1000);
  }
  return null;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== "subscription" || !session.subscription) break;

      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );
      const userId = parseInt(subscription.metadata.userId);
      if (!userId) break;

      const periodEnd = getSubscriptionPeriodEnd(subscription);

      await prisma.user.update({
        where: { id: userId },
        data: {
          plan: "premium",
          stripeSubscriptionId: subscription.id,
          planExpiresAt: periodEnd,
        },
      });

      // Set all owned listings to featured
      await prisma.listing.updateMany({
        where: { ownerId: userId },
        data: { featured: true },
      });

      await auditLog({
        userId,
        action: "subscription.created",
        targetType: "User",
        targetId: userId,
        details: { subscriptionId: subscription.id, plan: "premium" },
      });
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = parseInt(subscription.metadata.userId);
      if (!userId) break;

      const periodEnd = getSubscriptionPeriodEnd(subscription);

      if (subscription.status === "active" || subscription.status === "trialing") {
        await prisma.user.update({
          where: { id: userId },
          data: {
            plan: "premium",
            planExpiresAt: periodEnd,
          },
        });
      } else if (subscription.status === "past_due" || subscription.status === "unpaid") {
        await prisma.user.update({
          where: { id: userId },
          data: { planExpiresAt: periodEnd },
        });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = parseInt(subscription.metadata.userId);
      if (!userId) break;

      await prisma.user.update({
        where: { id: userId },
        data: {
          plan: "free",
          stripeSubscriptionId: null,
          planExpiresAt: null,
        },
      });

      // Remove featured from owned listings
      await prisma.listing.updateMany({
        where: { ownerId: userId },
        data: { featured: false },
      });

      await auditLog({
        userId,
        action: "subscription.canceled",
        targetType: "User",
        targetId: userId,
        details: { subscriptionId: subscription.id },
      });
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      console.error("Payment failed for invoice:", invoice.id, "customer:", invoice.customer);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
