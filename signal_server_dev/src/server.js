import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
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

const PORT = 3000;

const socketRooms = {};
const users = {};
const MAXIMUM = 2;

io.on('connection', socket => {
  console.log(socket.id, 'connection');

  socket.on('join_room', roomId => {
    // 방이 기존에 생성 됐다면
    if (socketRooms[roomId]) {
      const currentRoomUsersCnt = socketRooms[roomId].length;
      if (currentRoomUsersCnt === MAXIMUM) {
        socket.emit('room_full');
        console.log('full');
        return;
      }

      // 여분의 자리가 있다면 해당 방 배열에 추가해줌
      socketRooms[roomId] = [...socketRooms[roomId], { id: socket.id }];
      console.log('second room: ', socketRooms);
    } else {
      // 방이 존재하지 않다면 값을 생성하고 추가해줌.
      socketRooms[roomId] = [{ id: socket.id }];
      console.log('first room: ', socketRooms);
    }

    users[socket.id] = roomId;
    socket.join(roomId);

    // 입장 전 해당 방에 다른 유저가 있는지 확인
    //있다면 offer-answer를 위해 알려줌
    const ohters = socketRooms[roomId].filter(user => user.id !== socket.id);
    if (ohters.length > 0) {
      socket.to(roomId).emit('welcome', ohters);
    }
  });

  // offer를 전달받고 다른 유저들에게 전달해준다.
  socket.on('offer', (sdp, roomName) => {
    socket.to(roomName).emit('offer', sdp);
  });

  // answer를 전달받고, 다른 유저들에게 전달해준다.
  socket.on('answer', (sdp, roomName) => {
    socket.to(roomName).emit('answer', sdp);
  });

  // candidate를 전달받고, 다른 유저들에게 전달해준다.
  socket.on('candidate', (candidate, roomName) => {
    socket.to(roomName).emit('candidate', candidate);
  });

  // 방을 나간다면
  socket.on('disconnect', () => {
    const roomID = users[socket.id];

    if (socketRooms[roomID]) {
      socketRooms[roomID] = socketRooms[roomID].filter(user => user.id !== socket.id);
      if (socketRooms[roomID].length === 0) {
        delete socketRooms[roomID];
        return;
      }
    }
    delete users[socket.id];

    socket.broadcast.to(socketRooms[roomID]).emit('user_exit', { id: socket.id });

    console.log('disconnect', socketRooms);
  });
});

server.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
