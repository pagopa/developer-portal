/* eslint-disable functional/no-expression-statements */
import { NextRequest, NextResponse } from 'next/server';
import { defaultLocale } from '@/config';
import { SUPPORTED_LOCALES } from '@/locales';

// This middleware redirects URLs without locale prefixes to include the default locale,
// maintaining backwards compatibility with legacy indexed URLs and CMS' resources URLs
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = SUPPORTED_LOCALES.some(
    (locale) =>
      pathname.startsWith(`/${locale.langCode}/`) ||
      pathname === `/${locale.langCode}`
  );

  if (pathnameHasLocale) return;

  const defaultLangCode = defaultLocale.split('-')[0];
  console.info(
    `Rewriting path ${pathname} to include default locale '${defaultLangCode}'`
  );
  // eslint-disable-next-line functional/immutable-data
  request.nextUrl.pathname = `/${defaultLangCode}${pathname}`;
  return NextResponse.rewrite(request.nextUrl);
}

export const config = {
  matcher: [
    // Exclude Next internals, API, known public files
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|routes/|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|map|txt|xml|json|woff2?|ttf|eot)$).*)',
  ],
};
