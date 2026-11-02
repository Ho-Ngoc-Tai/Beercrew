import { AUTH_SIGNIN_PAGE, HOME_PAGE } from "@routes/web";
import { WEB_PRIVATE_ROUTE } from "@routes/web.private";
import { NextRequest, NextResponse } from "next/server";

export function secure(resp: NextResponse): NextResponse {
  resp.headers.set("X-Frame-Options", "DENY");
  resp.headers.set("X-Content-Type-Options", "nosniff");
  resp.headers.set("X-XSS-Protection", "1; mode=block");
  resp.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  resp.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );
  resp.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), browsing-topics=()"
  );
  return resp;
}

export async function proxy(req: NextRequest): Promise<NextResponse> {
  const pathname = req.nextUrl.pathname;
  const tokenName = process.env.COOKIE_TOKEN_NAME || "vtt";
  const token = req.cookies.get(tokenName)?.value;
  const isAuth = Boolean(token);

  // If already authenticated and accessing login page, redirect to home
  if (pathname === AUTH_SIGNIN_PAGE && isAuth) {
    return secure(NextResponse.redirect(new URL(HOME_PAGE, req.nextUrl.origin)));
  }

  // If private route and not authenticated, redirect to signin with query redirect
  const isPrivate = WEB_PRIVATE_ROUTE.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isPrivate && !isAuth) {
    const loginUrl = new URL(AUTH_SIGNIN_PAGE, req.nextUrl.origin);
    loginUrl.searchParams.set("redirect", pathname);
    return secure(NextResponse.redirect(loginUrl));
  }

  return secure(NextResponse.next());
}
