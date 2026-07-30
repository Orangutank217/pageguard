import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { updateStatusPageSchema } from "@/lib/validators";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Delete linked monitor associations first
  await supabase.from("status_page_monitors").delete().eq("status_page_id", id);

  const { error } = await supabase
    .from("status_pages")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = updateStatusPageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const updateData: Record<string, unknown> = {};
  if (parsed.data.title !== undefined) updateData.title = parsed.data.title;
  if (parsed.data.description !== undefined) updateData.description = parsed.data.description;
  if (parsed.data.is_public !== undefined) updateData.is_public = parsed.data.is_public;

  if (Object.keys(updateData).length > 0) {
    const { error } = await supabase
      .from("status_pages")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  // Update monitor links if provided
  if (parsed.data.monitor_ids) {
    await supabase
      .from("status_page_monitors")
      .delete()
      .eq("status_page_id", id);

    if (parsed.data.monitor_ids.length > 0) {
      const links = parsed.data.monitor_ids.map((monitor_id) => ({
        status_page_id: id,
        monitor_id,
      }));
      await supabase.from("status_page_monitors").insert(links);
    }
  }

  return NextResponse.json({ ok: true });
}
