export function selectEmbedType(
  url: string
): 'codepen' | 'figma' | 'youtube' | 'arcade' | 'link' {
  if (url.match(/^(https?:\/\/)?([\w.-]+\.)?codepen\.io/)) {
    return 'codepen';
  }
  if (
    url.match(
      /https:\/\/([\w.-]+\.)?figma.com\/(file|proto|design)\/([0-9a-zA-Z]{22,128})/
    )
  ) {
    return 'figma';
  }
  if (url.match(/^(https?:\/\/)?([\w.-]+\.)?youtube\.com/)) {
    return 'youtube';
  }
  if (
    url.match(
      /^https:\/\/app\.arcade\.software\/(flows|share)\/[A-Za-z0-9_-]+(\/view)?\/?$/
    )
  ) {
    return 'arcade';
  }
  return 'link';
}
