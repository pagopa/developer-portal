export function selectEmbedType(
  url: string
): 'codepen' | 'figma' | 'youtube' | 'link' {
  if (url.includes('codepen.io')) {
    return 'codepen';
  }
  if (
    url.match(
      /https:\/\/([\w.-]+\.)?figma.com\/(file|proto)\/([0-9a-zA-Z]{22,128})/
    )
  ) {
    return 'figma';
  }
  if (url.includes('youtube.com')) {
    return 'youtube';
  }
  return 'link';
}
