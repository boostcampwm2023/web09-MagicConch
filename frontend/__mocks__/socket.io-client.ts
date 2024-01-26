export const io = vi.fn().mockReturnValue({
  on: vi.fn(),
  emit: vi.fn(),
  disconnect: vi.fn(),
  connected: true,
});
