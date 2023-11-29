import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { v4 } from 'uuid';
const __dirname = path.resolve();

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
});

const PORT = 3001;

const socketRooms = {};
const users = {};
const MAXIMUM = 2;

io.on('connection', socket => {
  socket.on('offer', (sdp, roomName) => {
    socket.to(roomName).emit('offer', sdp);
  });

  socket.on('answer', (sdp, roomName) => {
    socket.to(roomName).emit('answer', sdp);
  });

  socket.on('candidate', (candidate, roomName) => {
    socket.to(roomName).emit('candidate', candidate);
  });

  socket.on('disconnect', () => {
    const roomID = users[socket.id];

    if (socketRooms[roomID]) {
      socketRooms[roomID].users = socketRooms[roomID].users.filter(userID => userID !== socket.id);

      if (socketRooms[roomID].users.length === 0) {
        delete socketRooms[roomID];
        return;
      }
    }
    delete users[roomID];

    socket.to(roomID).emit('userExit', { id: socket.id });
    console.log('exit user: ', socketRooms, roomID);
  });

  socket.on('createRoom', password => {
    const roomID = v4();

    socketRooms[roomID] = { users: [socket.id], password: password };

    users[socket.id] = roomID;
    socket.join(roomID);
    socket.emit('roomCreated', roomID);

    console.log('room created: ', roomID, password, socketRooms);
  });

  socket.on('joinRoom', (roomID, password) => {
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

    socketRooms[roomID].users.push(socket.id);
    users[socket.id] = roomID;
    socket.join(roomID);

    const ohterUsers = socketRooms[roomID].users.filter(userID => userID !== socket.id);
    socket.to(roomID).emit('welcome', ohterUsers);

    socket.emit('joinRoomSuccess', roomID);
  });
});

server.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
