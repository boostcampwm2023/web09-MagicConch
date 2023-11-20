import { Socket, io } from 'socket.io-client';

const URL = 'http://localhost:3000';

let socket: Socket;

export function connect() {
  if (socket != undefined) {
    socket.disconnect();
  }
  socket = io(URL);
}

export function getSocket() {
  return socket;
}

export function setMessageEventListener(listener: (message: string | ReadableStream<string>) => void) {
  socket.on('message', message => {
    if (typeof message === 'string') {
      listener(message);
      return;
    }
    console.log(message);
    const reader = message?.getReader();

    let content = '';

    const readStream = () => {
      reader?.read().then(({ done, value }: any) => {
        if (done) return console.log('done');

        content += new TextDecoder().decode(value);
        console.log(content);

        return readStream();
      });
    };
    readStream();
  });
}

export function sendMessage(message: string) {
  socket.emit('message', message);
}
