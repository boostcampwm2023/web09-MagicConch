import { Socket, io } from 'socket.io-client';

const URL = 'http://localhost:3000';

let socket: Socket;

export function connect() {
  if (socket != undefined) {
    socket.disconnect();
  }
  socket = io(URL);

  socket.on('streamData', message => console.log(message));
  socket.on('streamEnd', () => console.log('streamEnd'));
}

export function getSocket() {
  return socket;
}

export function setMessageEventListener(listener: (message: string | ReadableStream<string>) => void) {
  socket.on('message', listener);
}

export function sendMessage(message: string) {
  socket.emit('message', message);
}
