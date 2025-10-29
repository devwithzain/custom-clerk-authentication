import { NextResponse } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isSellerRoute = createRouteMatcher(['/seller(.*)']);

export default clerkMiddleware(async (auth, req) => {
   if (isAdminRoute(req) && (await auth()).sessionClaims?.metadata?.role !== 'admin') {
      const url = new URL('/sign-in', req.url);
      return NextResponse.redirect(url);
   }
});

export const config = {
   matcher: [
      '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
      '/(api|trpc)(.*)',
   ],
};