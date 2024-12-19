import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");

    if (code) {
      const supabase = createRouteHandlerClient({ cookies });
      await supabase.auth.exchangeCodeForSession(code);
    }

    // Get the site URL from environment variable or request origin
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin;

    // Redirect to the home page
    return NextResponse.redirect(siteUrl);
  } catch (error) {
    console.error("Auth callback error:", error);
    return NextResponse.redirect(`${request.url}/error`);
  }
}
