import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createMonitorSchema } from "@/lib/validators";
import { getPlanLimits, enforceInterval } from "@/lib/plan-limits";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: monitors, error } = await supabase
    .from("monitors")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(monitors);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Get user profile for plan
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const plan = profile?.plan ?? "free";
  const limits = getPlanLimits(plan);

  // Validate input
  const body = await request.json();
  const parsed = createMonitorSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { name, url, interval_minutes, alert_email } = parsed.data;
  const coercedInterval = enforceInterval(plan, interval_minutes);

  // Check plan limit: max monitors
  const { count } = await supabase
    .from("monitors")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (count !== null && count >= limits.maxMonitors) {
    return NextResponse.json(
      { error: `Free plan allows a maximum of ${limits.maxMonitors} monitor(s). Upgrade to Pro for more.` },
      { status: 403 }
    );
  }

  const { data: monitor, error } = await supabase
    .from("monitors")
    .insert({
      user_id: user.id,
      name,
      url,
      interval_minutes: coercedInterval,
      alert_email: alert_email || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(monitor, { status: 201 });
}
