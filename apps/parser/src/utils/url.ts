export const stripUrlDecorations = (rawUrl: string): string => {
  const trimmed = rawUrl.trim();
  if (trimmed.length === 0) {
    return trimmed;
  }
  const [withoutParams] = trimmed.split(/[?#]/);
  return withoutParams !== '/' && withoutParams.endsWith('/')
    ? withoutParams.slice(0, -1)
    : withoutParams;
};

export const normalizeUrl = (rawUrl: string): string => {
  try {
    const parsed = new URL(rawUrl);
    parsed.hash = '';
    if (parsed.pathname.length > 1 && parsed.pathname.endsWith('/')) {
      parsed.pathname = parsed.pathname.slice(0, -1);
    }
    const serialized = parsed.toString();
    if (parsed.pathname === '/' && !parsed.search) {
      return serialized.endsWith('/') ? serialized.slice(0, -1) : serialized;
    }
    return serialized;
  } catch (_error) {
    return rawUrl;
  }
};
