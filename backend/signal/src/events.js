import { v4 } from 'uuid';

const socketRooms = {};
const users = {};
const MAXIMUM = 2;

export function createRoom(socket, password) {
  const roomID = v4();
  const userID = socket.id;

  socketRooms[roomID] = { users: [userID], password: password };

  users[userID] = { roomID, role: 'host' };
  socket.join(roomID);
  socket.emit('roomCreated', roomID);

  console.log('room created: ', userID, roomID, password, users);
}

export function joinRoom(socket, roomID, password) {
  const existRoom = socketRooms[roomID];
  const wrongPassword = socketRooms[roomID].password !== password;
  if (!existRoom || wrongPassword) {
    socket.emit('joinRoomFailed');
    console.log('joinRoomFailed', roomID, password);
    return;
  }

  const fullRoom = socketRooms[roomID].users.length === MAXIMUM;
  if (fullRoom) {
    socket.emit('roomFull');
    console.log('rommFull', socketRooms, roomID);
    return;
  }

  const userID = socket.id;

  socketRooms[roomID].users.push(userID);
  users[userID] = { roomID, role: 'guest' };
  socket.join(roomID);

  const ohterUsers = socketRooms[roomID].users.filter(
    (_userID) => _userID !== userID,
  );
  socket.to(roomID).emit('welcome', ohterUsers);

  socket.emit('joinRoomSuccess', roomID);
  console.log('joinRoomSuccess', userID, roomID, users);
}

export function disconnectSocket(socket) {
  const userID = socket.id;
  const user = users[userID];

  if (!user) return;

  const { roomID, role } = user;

  delete users[userID];

  if (!socketRooms[roomID]) {
    return;
  }

  if (role === 'host') {
    socket.to(roomID).emit('hostExit');
    delete socketRooms[roomID];

    console.log('host exit: ', userID, roomID, users);
  } else if (role === 'guest') {
    socketRooms[roomID].users = socketRooms[roomID].users.filter(
      (_userID) => _userID !== userID,
    );

    socket.to(roomID).emit('userExit', { id: socket.id });

    console.log('exit user: ', userID, roomID, users);
  }
}
