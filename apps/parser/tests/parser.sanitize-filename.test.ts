import { sanitizeUrlAsFilename } from "../src/helpers/url-handling";

const BASE_SCOPE = "";
describe("sanitizeUrlAsFilename", () => {
  it("sanitizes URL paths with query strings and fragments", () => {
    expect(
      sanitizeUrlAsFilename(
        "/docs/guide?version=1.0&lang=en#section",
        BASE_SCOPE,
      ),
    ).toBe("docs-guide-version=1.0&lang=en#section");
  });

  it("sanitizes URL paths with special characters", () => {
    expect(sanitizeUrlAsFilename("/api/v1/users:profile", BASE_SCOPE)).toBe(
      "api-v1-users-profile",
    );
  });

  it("sanitizes control characters in URL paths", () => {
    expect(
      sanitizeUrlAsFilename("/path\u0000with\u0001control.html", BASE_SCOPE),
    ).toBe("path-with-control.html");
  });

  it('replaces reserved names "." and ".."', () => {
    expect(sanitizeUrlAsFilename(".", BASE_SCOPE)).toBe("-");
    expect(sanitizeUrlAsFilename("..", BASE_SCOPE)).toBe("-");
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
      expect(sanitizeUrlAsFilename(name, BASE_SCOPE)).toBe("-");
      expect(sanitizeUrlAsFilename(name.toUpperCase(), BASE_SCOPE)).toBe("-");
    }
  });

  it("uses custom replacement option for URL paths", () => {
    expect(
      sanitizeUrlAsFilename("/api/users/123", BASE_SCOPE, { replacement: "_" }),
    ).toBe("api_users_123");
  });

  it("falls back to default replacement for invalid replacement chars", () => {
    expect(
      sanitizeUrlAsFilename("/docs/guide?ref=x", BASE_SCOPE, {
        replacement: "/",
      }),
    ).toBe("docs-guide-ref=x");
    expect(
      sanitizeUrlAsFilename("/docs/guide", BASE_SCOPE, {
        replacement: "\u0000",
      }),
    ).toBe("docs-guide");
  });

  it("appends hash suffix for URLs exceeding length threshold", () => {
    const longUrl = "/docs/" + "very-long-path-segment/".repeat(20);
    const result = sanitizeUrlAsFilename(longUrl, BASE_SCOPE, {
      lengthThreshold: 255,
    });
    expect(result.length).toBe(255);
  });

  it("trims leading dashes from URL paths", () => {
    expect(sanitizeUrlAsFilename("/////path", BASE_SCOPE)).toBe("path");
  });

  it("returns unchanged valid URL path", () => {
    expect(sanitizeUrlAsFilename("api-reference.html", BASE_SCOPE)).toBe(
      "api-reference.html",
    );
  });

  it("ignores illegal characters in replacement option", () => {
    expect(
      sanitizeUrlAsFilename("/docs/guide", BASE_SCOPE, { replacement: "*" }),
    ).toBe("docs-guide");
  });

  it("ignores control chars in replacement option", () => {
    expect(
      sanitizeUrlAsFilename("/docs/guide", BASE_SCOPE, {
        replacement: "\u0000",
      }),
    ).toBe("docs-guide");
  });

  it("sanitizes URL with subdomain path", () => {
    expect(
      sanitizeUrlAsFilename("showcase.example.com/docs-guide", BASE_SCOPE),
    ).toBe("showcase.example.com-docs-guide");
  });

  it("handles URL with numbers and hyphens", () => {
    expect(sanitizeUrlAsFilename("/api/v2/resource-123", BASE_SCOPE)).toBe(
      "api-v2-resource-123",
    );
  });
});
