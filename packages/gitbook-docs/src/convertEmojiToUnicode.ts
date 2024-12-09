// import emojiData from 'emojibase-data/en/compact.json';

export const convertEmojiToUnicode = (match: string): string => {
  return match;
  // const emojiName = match.replace(/:/g, '');
  // const result = emojiData.find(({ label }) => label === emojiName);
  // if (result) {
  //   return result.unicode;
  // }
  // const fallbackResult = emojiData.find(({ tags }) =>
  //   tags?.some((tag) => tag === emojiName)
  // );
  // return fallbackResult?.unicode ? fallbackResult.unicode : match;
};
