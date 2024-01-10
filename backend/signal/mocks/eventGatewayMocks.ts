type User = {
  roomId: string;
  role: 'host' | 'guest';
};
type Room = {
  roomId: string;
  password: string;
  wrongRoomId: string;
  wrongPassword: string;
};
export type SocketMock = {
  id: string;
  emit: jest.Mock;
  join: jest.Mock;
  to: jest.Mock;
};

export const hostUserMock: User = {
  roomId: 'testRoomId',
  role: 'host',
};
export const guestUserMock: User = {
  roomId: 'testRoomId',
  role: 'guest',
};
export const roomMock: Room = {
  roomId: 'testRoomId',
  password: 'testPassword',
  wrongRoomId: 'wrongRoomId',
  wrongPassword: 'wrongPassword',
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

export const loggerServiceMock = { debug: jest.fn(), info: jest.fn() };

export const createRoomMock = (users: string[]) => ({
  [roomMock.roomId]: {
    users,
    password: roomMock.password,
  },
});

export const twoPeopleInsideRoomMock = () =>
  createRoomMock([hostSocketMock.id, guestSocketMock.id]);
export const onlyGuestInsideRoomMock = () =>
  createRoomMock([guestSocketMock.id]);
export const onlyHostInsideRoomMock = () => createRoomMock([hostSocketMock.id]);

export const createUsersMock = (mock: Array<{ id: string; user: User }>) =>
  mock.reduce((acc, { id, user }) => ({ ...acc, [id]: user }), {});

export const twoPeopleInsideUsersMock = () =>
  createUsersMock([
    { id: hostSocketMock.id, user: hostUserMock },
    { id: guestSocketMock.id, user: guestUserMock },
  ]);
export const onlyGuestInsideUsersMock = () =>
  createUsersMock([{ id: guestSocketMock.id, user: guestUserMock }]);
export const onlyHostInsideUsersMock = () =>
  createUsersMock([{ id: hostSocketMock.id, user: hostUserMock }]);
