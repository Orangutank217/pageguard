import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createStatusPageSchema } from "@/lib/validators";
import { getPlanLimits } from "@/lib/plan-limits";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: pages, error } = await supabase
    .from("status_pages")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Fetch linked monitors for each page
  const pagesWithMonitors = await Promise.all(
    (pages ?? []).map(async (page) => {
      const { data: links } = await supabase
        .from("status_page_monitors")
        .select("monitor_id")
        .eq("status_page_id", page.id);

      return {
        ...page,
        monitor_ids: links?.map((l) => l.monitor_id) ?? [],
      };
    })
  );

  return NextResponse.json(pagesWithMonitors);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const plan = profile?.plan ?? "free";
  const limits = getPlanLimits(plan);

  const body = await request.json();
  const parsed = createStatusPageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { title, slug, description, monitor_ids } = parsed.data;

  // Check plan limit
  const { count } = await supabase
    .from("status_pages")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (count !== null && count >= limits.maxStatusPages) {
    return NextResponse.json(
      { error: `Free plan allows a maximum of ${limits.maxStatusPages} status page(s).` },
      { status: 403 }
    );
  }

  // Create status page
  const { data: page, error } = await supabase
    .from("status_pages")
    .insert({ user_id: user.id, title, slug, description })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Slug already taken" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Link monitors
  if (monitor_ids.length > 0) {
    const links = monitor_ids.map((monitor_id) => ({
      status_page_id: page.id,
      monitor_id,
    }));
    await supabase.from("status_page_monitors").insert(links);
  }

  return NextResponse.json({ ...page, monitor_ids }, { status: 201 });
}
