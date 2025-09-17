export function generateIdFromString(id: string | undefined): string {
  if (id === undefined) return '';
  return id
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, '')
    .replace(/^\s*/, '')
    .replace(/[@#]/g, '')
    .normalize('NFD') // Split an accented letter in the base letter and the accent
    .replace(/[\u0300-\u036f]/g, '') // Remove all accents
    .replace(/\s+/g, '-'); // Replace multiple spaces with a single -
}
