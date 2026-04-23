import { API_URL } from "@/config/api";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for static files, API routes, and Next.js internals
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|robots.txt|sitemap.xml|manifest.json).*)",
  ],
};
