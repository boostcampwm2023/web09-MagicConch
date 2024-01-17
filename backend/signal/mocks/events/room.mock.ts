import { guestSocketMock, hostSocketMock } from './socket.mock';

type Room = {
  roomId: string;
  password: string;
  wrongRoomId: string;
  wrongPassword: string;
};

export const roomMock: Room = {
  roomId: 'testRoomId',
  password: 'testPassword',
  wrongRoomId: 'wrongRoomId',
  wrongPassword: 'wrongPassword',
};

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
