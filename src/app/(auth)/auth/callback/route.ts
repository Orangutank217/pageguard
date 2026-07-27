import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

async function handleCallback(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // Check if Supabase sent an error (e.g. OAuth processing failed)
  const errorParam = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  if (errorParam) {
    console.error("Supabase OAuth error:", errorParam, errorDescription);
    return NextResponse.redirect(
      `${origin}/auth/signin?error=oauth_error&error_detail=${encodeURIComponent(errorParam + (errorDescription ? ": " + errorDescription : ""))}`
    );
  }

  const next = searchParams.get("next") ?? searchParams.get("redirectTo") ?? "/dashboard";

  if (code) {
    // Create the redirect response FIRST — cookies set during
    // exchangeCodeForSession must be attached to this response
    // so the browser receives them.
    const response = NextResponse.redirect(`${origin}${next}`);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return response;
    }

    // Pass the real error to the signin page for debugging
    const errorMsg = error.message || "unknown";
    const errorCode = error.code || "";
    console.error("exchangeCodeForSession error:", errorMsg, errorCode);
    return NextResponse.redirect(
      `${origin}/auth/signin?error=auth_failed&error_detail=${encodeURIComponent(errorMsg)}&error_code=${encodeURIComponent(errorCode)}`
    );
  }

  // No code present at all — this typically happens when Supabase Auth
  // settings (Site URL / Redirect URLs) aren't configured correctly,
  // or the PKCE code verifier cookie wasn't passed through the OAuth flow.
  console.error("Callback received without code. URL:", request.url);
  return NextResponse.redirect(
    `${origin}/auth/signin?error=no_code&error_detail=${encodeURIComponent("No code was provided in the callback URL. Check that Supabase Auth Site URL is set to https://www.pguard.co and Redirect URLs includes https://www.pguard.co/auth/callback")}`
  );
}

export const GET = handleCallback;
export const POST = handleCallback;
