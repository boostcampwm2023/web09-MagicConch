export const HumanSocketManager = {
  getInstance: vi.fn().mockReturnValue({
    connect: vi.fn(),
    disconnect: vi.fn(),
    on: vi.fn(),
    emit: vi.fn(),
    socket: {},
    connected: false,
  }),
};
