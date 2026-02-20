let params = { locale: 'it' };

export function setMockParams(newParams: { locale: string }) {
  params = newParams;
}

export function useParams() {
  return params;
}

// Stub any other hooks your app might import from next/navigation
export function useRouter() {
  return {
    push: () => {},
    replace: () => {},
    prefetch: () => {},
  };
}
export function usePathname() {
  return '/';
}
export function useSearchParams() {
  return new URLSearchParams();
}
export function useSelectedLayoutSegments() {
  return [];
}
export function useSelectedLayoutSegment() {
  return '';
}
