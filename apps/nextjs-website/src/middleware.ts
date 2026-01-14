/* eslint-disable functional/no-expression-statements */
import { NextRequest, NextResponse } from 'next/server';
import { i18nActive } from '@/config';

export function middleware(request: NextRequest) {
  if (!i18nActive) return;

  const { pathname } = request.nextUrl;

  console.info(`Rewriting path ${pathname} to include default locale 'it'`);
  // eslint-disable-next-line functional/immutable-data
  request.nextUrl.pathname = `/it${pathname}`;
  return NextResponse.rewrite(request.nextUrl);
}

export const config = {
  matcher: [
    // Exclude Next internals, API, known public files, and paths already starting with a locale
    '/((?!_next/static|_next/image|api|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|map|txt|xml|json|woff2?|ttf|eot)$|en(?:/|$)|it(?:/|$)).*)',
  ],
};
