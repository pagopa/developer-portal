import { sanitizeUrlAsFilename } from "../src/helpers/url-handling";

describe("sanitizeFilename", () => {
  it("replaces illegal characters", () => {
    expect(sanitizeUrlAsFilename("file/name?with*illegal|chars.txt")).toBe(
      "file-name-with-illegal-chars.txt",
    );
  });

  it("replaces control characters", () => {
    expect(sanitizeUrlAsFilename("file\u0000name\u0001.txt")).toBe(
      "file-name-.txt",
    );
  });

  it('replaces reserved names "." and ".."', () => {
    expect(sanitizeUrlAsFilename(".")).toBe("-");
    expect(sanitizeUrlAsFilename("..")).toBe("-");
  });

  it("replaces Windows reserved names", () => {
    const reserved = [
      "con",
      "prn",
      "aux",
      "nul",
      "COM1",
      "LPT1",
      "com9",
      "lpt9",
    ];
    for (const name of reserved) {
      expect(sanitizeUrlAsFilename(name)).toBe("-");
      expect(sanitizeUrlAsFilename(name.toUpperCase())).toBe("-");
    }
  });

  it("returns default replacement for empty input", () => {
    expect(sanitizeUrlAsFilename("")).toBe("-");
    expect(sanitizeUrlAsFilename(null as unknown as string)).toBe("-");
    expect(sanitizeUrlAsFilename(undefined as unknown as string)).toBe("-");
  });

  it("uses the replacement option", () => {
    expect(sanitizeUrlAsFilename("file/name", { replacement: "-" })).toBe(
      "file-name",
    );
  });

  it("falls back to default replacement for invalid replacement", () => {
    expect(sanitizeUrlAsFilename("file/name", { replacement: "/" })).toBe(
      "file-name",
    );
    expect(sanitizeUrlAsFilename("file/name", { replacement: "\u0000" })).toBe(
      "file-name",
    );
  });

  it("limits output to 255 characters", () => {
    const longName = "a".repeat(300) + ".txt";
    expect(sanitizeUrlAsFilename(longName).length).toBe(255);
  });

  it("returns replacement for input with only illegal/control chars", () => {
    expect(sanitizeUrlAsFilename("\u0000\u0001\u0002")).toBe("---");
    expect(sanitizeUrlAsFilename("////")).toBe("----");
  });

  it("returns unchanged valid filename", () => {
    expect(sanitizeUrlAsFilename("valid-filename.txt")).toBe(
      "valid-filename.txt",
    );
  });

  it("ignores illegal replacement chars", () => {
    expect(sanitizeUrlAsFilename("file/name", { replacement: "*" })).toBe(
      "file-name",
    );
  });

  it("ignores control char replacement", () => {
    expect(sanitizeUrlAsFilename("file/name", { replacement: "\u0000" })).toBe(
      "file-name",
    );
  });
});
