import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

//Define a middleware function that accept a request type
export async function proxy(request: NextRequest) {

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

    //Auth-related paths
    const authPaths = ["/auth/login", "/auth/signup"];
    const isAuthPath = authPaths.some((path) => pathname.startsWith(path));


    // if trying to access a protected path without a valid token, redirect to login
    if (isProtectedPath && !token){
        const loginUrl = new URL("/auth/login", request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // If user is already authenticated and tries to access login
    if(token && isAuthPath){
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
        "/auth/login",
        "/auth/signup",
        // Add more protected or public routes here later
    ],
};