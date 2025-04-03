import { NextResponse } from "next/server";
import { cookies } from 'next/headers'

export async function middleware(request) {
    const sessionCookie = (await cookies()).get("better-auth.session_token");
 
	if (!sessionCookie) {
		return NextResponse.redirect(new URL("/login", request.url));
	}
 
	return NextResponse.next();
}

export const config = {
    matcher: ["/", "/notes/(.+)"], // Apply middleware to the root route
};