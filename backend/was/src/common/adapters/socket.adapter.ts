import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

export class SocketAdapter extends IoAdapter {
  private readonly origin: string;

  constructor(origin: string) {
    super();
    this.origin = origin;
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const cors = {
      origin: this.origin,
      credentials: true,
    };
    const server: any = super.createIOServer(port, {
      ...options,
      cors: cors,
    });
    console.log(server);
    return server;
  }
}
