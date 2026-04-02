import {withAuth} from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(){

        return NextResponse.next()
    },
    {
        pages: {
            signIn: "/login",
          },
        callbacks: {
            authorized({req, token}) {
                const { pathname } = req.nextUrl
                if(
                    pathname.startsWith("/api/auth") ||
                    pathname.startsWith("/api/videos") ||
                    pathname === '/' ||
                    pathname === "/login" ||
                    pathname === "/signup" || 
                    pathname === '/register'
             ) {return true; } 
             return !! token   // If there is token, the user is authenticated
            }
        }
    }
   )

//    export const config = {
//     matcher: ["/dashboard/:path*"]
//   }


export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|public/).*)"
    ]
}
