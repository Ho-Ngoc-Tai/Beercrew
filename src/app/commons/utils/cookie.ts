export interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "strict" | "lax" | "none";
  path: string;
  maxAge: number;
  domain?: string;
}

export function getDefaultCookieOptions(maxAgeSeconds = 7 * 24 * 60 * 60): CookieOptions {
  const isProduction = process.env.NODE_ENV === "production";
  const domain = process.env.COOKIE_DOMAIN;

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds,
    ...(domain && domain !== "localhost" ? { domain } : {}),
  };
}
