export const mockEventType: any = 'mockEventType';

export const mockListener = vi.fn();

export const mockOptions: any = {};

export const setupEventListener = (events: any, target: any) => {
  target.addEventListener.mockImplementation((event: string, cb: any) => {
    events[event] = cb;
  });
  target.removeEventListener.mockImplementation((event: string, cb: any) => {
    delete events[event];
  });
};
