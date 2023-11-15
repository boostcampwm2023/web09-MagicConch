import { Socket, io } from 'socket.io-client';

const URL = 'http://localhost:3000';

let socket: Socket;

export function connect() {
  socket = io(URL);
}

export function getSocket() {
  return socket;
}
