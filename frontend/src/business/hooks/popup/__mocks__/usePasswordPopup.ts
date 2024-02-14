const openPasswordPopup = vi.fn();

export const usePasswordPopup = vi.fn().mockReturnValue({
  openPasswordPopup,
});
