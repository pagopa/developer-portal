/* eslint-disable functional/no-expression-statements */
import { NextRequest, NextResponse } from 'next/server';
import { amplifyConfig, defaultLocale } from '@/config';
import { SUPPORTED_LOCALES } from '@/locales';

const guestPaths = [
  '/auth/login',
  '/auth/sign-up',
  '/auth/password-reset',
  '/auth/expired-code',
  '/auth/account-activated',
  '/auth/change-password',
];

// This middleware redirects URLs without locale prefixes to include the default locale,
// maintaining backwards compatibility with legacy indexed URLs and CMS' resources URLs
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (guestPaths.some((path) => pathname.includes(path))) {
    const clientId = amplifyConfig.Auth.userPoolWebClientId;
    const lastAuthUserCookie = request.cookies.get(
      `CognitoIdentityServiceProvider.${clientId}.LastAuthUser`
    );

    if (lastAuthUserCookie) {
      const locale = SUPPORTED_LOCALES.find((loc) =>
        request.url.includes(`/${loc.langCode}/`)
      )?.langCode;
      return NextResponse.redirect(new URL(`/${locale ?? ''}`, request.url));
    }
  }

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
