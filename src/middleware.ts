import { NextRequest, NextResponse } from "next/server";
import NextAuth, { Session } from "next-auth";
import {
  publicRoutes,
  authRoutes,
  apiAuthPrefix,
  DEFAULT_LOGIN_REDIRECT,
} from "@/routes";
import authConfig from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

interface NextAuthRequest extends NextRequest {
  auth: Session | null;
}

export default auth(async function middleware(req: NextAuthRequest) {
  const isAuthorized = !!req.auth;
  const isApiAuthRoute = req.nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(req.nextUrl.pathname);

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isAuthorized) {
      return NextResponse.redirect(
        new URL(DEFAULT_LOGIN_REDIRECT, req.nextUrl)
      );
    }
    return NextResponse.next();
  }

  if (!isAuthorized && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
