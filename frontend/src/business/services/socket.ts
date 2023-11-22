import { Socket, io } from 'socket.io-client';

const URL = 'http://localhost:3000';

let socket: Socket;

export function connect() {
  if (socket != undefined) {
    socket.disconnect();
  }
  socket = io(URL);
}

export function setMessageEventListener(listener: (message: string) => void) {
  socket.on('message', listener);
}
export function setMessageUpdateEventListener(listener: (message: string) => void) {
  socket.on('messageUpdate', listener);
}
export function setStreamEndEventListener(listener: () => void) {
  socket.on('streamEnd', listener);
}
export function setTarotCardEventListener(listener: () => void) {
  socket.on('tarotCard', listener);
}
export function setChatEndEventListener(listener: (message: string) => void) {
  socket.on('chatEnd', listener);
}

export function sendMessage(message: string) {
  socket.emit('message', message);
}
export function requestTarotRead(tarotCard: number) {
  socket.emit('tarotRead', tarotCard);
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
