export const getHumanReadableFileSize = (kilobytes: number): string => {
  if (kilobytes <= 0) {
    return "0KB";
  }

  const units = ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const unitIndex = Math.floor(Math.log(kilobytes) / Math.log(1024));
  const size = kilobytes / Math.pow(1024, unitIndex);

  return `${Math.round(size)}${units[unitIndex]}`;
};
