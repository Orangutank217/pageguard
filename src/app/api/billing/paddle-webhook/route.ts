import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  // Read raw body for signature verification
  const rawBody = await request.text();
  const signature = request.headers.get("paddle-signature");
  const secret = process.env.PADDLE_WEBHOOK_SECRET_KEY;

  if (!secret) {
    console.error("Missing PADDLE_WEBHOOK_SECRET_KEY");
    return NextResponse.json({ error: "Server config error" }, { status: 500 });
  }

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 401 });
  }

  // Parse signature header: ts=1234567890;h1=abc123...
  const parts = signature.match(/^ts=(\d+);h1=(.+)$/);
  if (!parts) {
    return NextResponse.json({ error: "Invalid signature format" }, { status: 401 });
  }

  const timestamp = parts[1];
  const signatureHash = parts[2];

  // Build signed payload (Paddle format: timestamp:rawBody)
  const signedPayload = `${timestamp}:${rawBody}`;
  const computedHash = createHmac("sha256", secret)
    .update(signedPayload, "utf8")
    .digest("hex");

  // Timing-safe comparison
  if (
    computedHash.length !== signatureHash.length ||
    !timingSafeEqual(Buffer.from(computedHash), Buffer.from(signatureHash))
  ) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // Parse the verified payload
  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = payload.event_type;
  const supabase = createAdminClient();

  console.log(`Paddle webhook received: ${eventType}`);

  switch (eventType) {
    case "subscription.activated": {
      const userId = payload.data?.custom_data?.user_id;
      const subId = payload.data?.id;
      const custId = payload.data?.customer_id;

      if (!userId) {
        console.warn("No user_id in subscription.activated custom_data");
        break;
      }

      await supabase
        .from("profiles")
        .update({
          plan: "pro",
          paddle_subscription_id: subId,
          paddle_customer_id: custId,
        })
        .eq("id", userId);

      console.log(`User ${userId} upgraded to Pro (sub: ${subId})`);
      break;
    }

    case "subscription.updated": {
      const userId2 = payload.data?.custom_data?.user_id;
      const status = payload.data?.status;

      if (userId2 && status === "active") {
        // Ensure plan is pro
        await supabase
          .from("profiles")
          .update({ plan: "pro" })
          .eq("id", userId2);
      }
      break;
    }

    case "subscription.cancelled": {
      const userId3 = payload.data?.custom_data?.user_id;

      if (userId3) {
        await supabase
          .from("profiles")
          .update({ plan: "free" })
          .eq("id", userId3);

        console.log(`User ${userId3} cancelled, reverted to free`);
      }
      break;
    }

    case "transaction.completed": {
      // Payment succeeded — could log or update billing info
      console.log(
        `Transaction completed: ${payload.data?.id}`
      );
      break;
    }

    case "transaction.payment_failed": {
      // Payment failed — log for monitoring
      console.warn(
        `Payment failed: ${payload.data?.id}`
      );
      break;
    }

    default:
      console.log(`Unhandled event type: ${eventType}`);
  }

  return NextResponse.json({ ok: true });
}
