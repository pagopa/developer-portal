import { REQUEST_TIMEOUT_MS } from "../main";

export async function assertReachable(
  url: string,
  timeoutMs: number = REQUEST_TIMEOUT_MS,
): Promise<void> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      signal: controller.signal,
    });
    const text = await res.text();
    if (isCloudflareChallenge(text)) {
      console.warn(
        "Cloudflare protection detected, skipping reachability check.",
      );
      return;
    }
    if (!res.ok && res.status !== 405) {
      throw new Error(`Status ${res.status}`);
    }
  } catch (error) {
    if ((error as Error).name === "AbortError") {
      throw new Error(`Target ${url} is unreachable: request timed out`);
    }
    throw new Error(
      `Target ${url} is unreachable: ${(error as Error).message}`,
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

function isCloudflareChallenge(html: string): boolean {
  return /cloudflare|just a moment|verify you are human/i.test(html);
}

async function fetch(input: any, init?: any): Promise<any> {
  const { default: nodeFetch } = await import("node-fetch-commonjs");
  return nodeFetch(input, init);
}
