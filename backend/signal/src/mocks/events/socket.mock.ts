export type SocketMock = {
  id: string;
  emit: jest.Mock;
  join: jest.Mock;
  to: jest.Mock;
};

export const toRoomEmitMock = jest.fn();

export const guestSocketMock: SocketMock = {
  id: 'testGuestSocketId',
  emit: jest.fn(),
  join: jest.fn(),
  to: jest.fn().mockImplementation(() => ({ emit: toRoomEmitMock })),
};

export const hostSocketMock: SocketMock = {
  id: 'testHostSocketId',
  emit: jest.fn(),
  join: jest.fn(),
  to: jest.fn().mockImplementation(() => ({ emit: toRoomEmitMock })),
};
