import { NextResponse, type NextRequest } from "next/server";

const securityHeaders: Record<string, string> = {
  // Clickjacking / framing protection
  "X-Frame-Options": "DENY",
  "Content-Security-Policy":
    "frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
  // MIME sniffing protection
  "X-Content-Type-Options": "nosniff",
  // Privacy / referrer control
  "Referrer-Policy": "strict-origin-when-cross-origin",
  // Restrict powerful browser features (no camera/mic/geo on a portfolio)
  "Permissions-Policy":
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), accelerometer=(), gyroscope=(), magnetometer=()",
  // Isolation between origins
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-site",
  "Origin-Agent-Cluster": "?1",
  "X-DNS-Prefetch-Control": "off",
  // HSTS — only meaningful over HTTPS; safe behind Vercel/TLS.
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
};

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }

  // Keep the admin area out of search indexes.
  if (request.nextUrl.pathname.startsWith("/admin")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|mp4|webm|mp3|woff2?|ttf|otf|css)$).*)",
  ],
};