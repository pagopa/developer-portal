export function handleError(error: unknown) {
  console.error("Parser terminated with an error:", error);
  process.exitCode = 1;
}
