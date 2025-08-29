// Mock console.error to avoid noise in test output
export const consoleSpy = jest
  .spyOn(console, 'error')
  .mockImplementation(() => {
    // Mock implementation - do nothing
  });
