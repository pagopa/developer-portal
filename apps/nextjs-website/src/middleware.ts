/* eslint-disable functional/no-expression-statements */
import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'it'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  console.info(`Rewriting path ${pathname} to include default locale 'it'`);
  // eslint-disable-next-line functional/immutable-data
  request.nextUrl.pathname = `/it${pathname}`;
  return NextResponse.rewrite(request.nextUrl);
}

export const config = {
  matcher: ['/((?!_next).*)'],
};
