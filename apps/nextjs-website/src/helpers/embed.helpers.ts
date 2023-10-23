export function selectEmbedType(
  url: string
): 'codepen' | 'figma' | 'youtube' | 'link' {
  if (url.match(/^(https?:\/\/)?([\w.-]+\.)?codepen\.io/)) {
    return 'codepen';
  }
  if (
    url.match(
      /https:\/\/([\w.-]+\.)?figma.com\/(file|proto)\/([0-9a-zA-Z]{22,128})/
    )
  ) {
    return 'figma';
  }
  if (url.match(/^(https?:\/\/)?([\w.-]+\.)?youtube\.com/)) {
    return 'youtube';
  }
  return 'link';
}
