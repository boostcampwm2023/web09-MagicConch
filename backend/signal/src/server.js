import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { createRoom, disconnectSocket, joinRoom } from './events.js';

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

io.on('connection', socket => {
  socket.on('offer', (sdp, roomName) => socket.to(roomName).emit('offer', sdp));
  socket.on('answer', (sdp, roomName) => socket.to(roomName).emit('answer', sdp));
  socket.on('candidate', (candidate, roomName) => socket.to(roomName).emit('candidate', candidate));

  socket.on('createRoom', password => createRoom(socket, password));
  socket.on('joinRoom', (roomID, password) => joinRoom(socket, roomID, password));
  socket.on('disconnect', () => disconnectSocket(socket));
});

server.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
