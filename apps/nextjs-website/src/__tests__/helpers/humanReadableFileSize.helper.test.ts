import { getHumanReadableFileSize } from "@/helpers/humanReadableFileSize.helper";

describe("getHumanReadableFileSize", () => {
  it('should return "0KB" for 0 KB', () => {
    expect(getHumanReadableFileSize(0)).toStrictEqual("0KB");
  });

  it('should return "1KB" for 1 KB', () => {
    expect(getHumanReadableFileSize(1)).toStrictEqual("1KB");
  });

  it('should return "1MB" for 1024 KB', () => {
    expect(getHumanReadableFileSize(1024)).toStrictEqual("1MB");
  });

  it('should return "2MB" for 2048 KB', () => {
    expect(getHumanReadableFileSize(2048)).toStrictEqual("2MB");
  });

  it('should return "3MB" for 2636 KB', () => {
    expect(getHumanReadableFileSize(2636)).toStrictEqual("3MB");
  });

  it('should return "3MB" for 2636.61 KB', () => {
    expect(getHumanReadableFileSize(2636.61)).toStrictEqual("3MB");
  });

  it('should return "10MB" for 10000 KB', () => {
    expect(getHumanReadableFileSize(10000)).toStrictEqual("10MB");
  });

  it('should return "1GB" for 1048576 KB', () => {
    expect(getHumanReadableFileSize(1048576)).toStrictEqual("1GB");
  });
  it('should return "10GB" for 10485760 KB', () => {
    expect(getHumanReadableFileSize(10485760)).toStrictEqual("10GB");
  });
});
