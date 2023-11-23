import { Socket, io } from 'socket.io-client';

const URL = 'http://localhost:3000';

let socket: Socket;

export function connect() {
  if (socket != undefined) {
    socket.disconnect();
  }
  socket = io(URL);

  socket.on('error', error => console.error(error));
}

type AIClientEventNames = 'tarotCard' | 'chatEnd' | 'streamStart' | 'streaming' | 'streamEnd';
type AIServerEventNames = 'message' | 'tarotRead' | 'tarotRead';

export function aiSocketOn(eventName: AIClientEventNames, listener: (...args: unknown[]) => void) {
  socket.on(eventName, listener);
}
export function aiSocketEmit(eventName: AIServerEventNames, ...eventArgs: unknown[]) {
  socket.emit(eventName, ...eventArgs);
}

type SocketEventName = 'welcome' | 'offer' | 'answer' | 'candidate' | 'room_full' | 'join_room';

export function socketOn<T>(eventName: SocketEventName, eventListener: (args: T) => void) {
  socket.on(eventName, eventListener);
}
export function socketEmit(eventName: SocketEventName, ...eventArgs: unknown[]) {
  socket.emit(eventName, ...eventArgs);
}

export function connectSocket() {
  if (socket) {
    return;
  }
  socket = io(URL);
}
export function disconnectSocket() {
  socket.disconnect();
}
