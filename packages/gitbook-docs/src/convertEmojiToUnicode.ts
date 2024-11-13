import emojiData from 'emojibase-data/en/compact.json';

export const convertEmojiToUnicode = (match: string): string => {
  const emojiName = match.replace(/:/g, '');
  const result = emojiData.find(
    (emoji) =>
      emoji.label === emojiName || emoji.tags?.some((tag) => tag === emojiName)
  );
  return result?.unicode ? result?.unicode : match;
};
