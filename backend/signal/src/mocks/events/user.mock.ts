import { guestSocketMock, hostSocketMock } from './socket.mock';

type User = {
  roomId: string;
  role: 'host' | 'guest';
};

export const hostUserMock: User = {
  roomId: 'testRoomId',
  role: 'host',
};
export const guestUserMock: User = {
  roomId: 'testRoomId',
  role: 'guest',
};

export const twoPeopleInsideUsersMock = () =>
  createUsersMock([
    { id: hostSocketMock.id, user: hostUserMock },
    { id: guestSocketMock.id, user: guestUserMock },
  ]);
export const onlyGuestInsideUsersMock = () =>
  createUsersMock([{ id: guestSocketMock.id, user: guestUserMock }]);
export const onlyHostInsideUsersMock = () =>
  createUsersMock([{ id: hostSocketMock.id, user: hostUserMock }]);

export const createUsersMock = (mock: Array<{ id: string; user: User }>) =>
  mock.reduce((acc, { id, user }) => ({ ...acc, [id]: user }), {});
