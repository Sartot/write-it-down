import { NextResponse } from "next/server"

export function middleware(request){
    // console.log(request.cookies.getAll());
    // return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
    matcher: ['/']
}