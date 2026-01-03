import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

//Define a middleware function that accept a request type
export async function middleware(request: NextRequest) {

    // Firstly we must get the session token
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const { pathname } = request.nextUrl;


    // Define which paths should be protected
    const protectedPaths = ["/dashboard", "/boards", "/settings"];
    const isProtectedPath = protectedPaths.some((path) =>
        pathname.startsWith(path)
    );

    // If trying to access a protected path with no session, get redirect back to login
    if (isProtectedPath || !token) {
        const loginUrl = new URL("/auth/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname); // So they return after login
        return NextResponse.redirect(loginUrl);
    }

    // Allowing access to public path even after they have login 
    if (token && (pathname === "/auth/login" || pathname === "/auth/signup")) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }


    // For all other cases → allow the request to continue
    return NextResponse.next();
};



// Specify which routes this middleware applies to
export const config = {
    matcher: [
        "/dashboard/:path*",   // All subpaths under /dashboard
        "/boards/:path*",
        "/settings/:path*",
        "/login",
        "/signup",
        // Add more protected or public routes here later
    ],
};