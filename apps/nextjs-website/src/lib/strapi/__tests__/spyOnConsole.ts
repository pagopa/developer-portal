// Mock console.error to avoid noise in test output
export const spyOnConsoleError = jest
  .spyOn(console, "error")
  .mockImplementation(() => {
    // Mock implementation - do nothing
  });
