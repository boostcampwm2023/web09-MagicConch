import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { SocketService } from './socket.service';

@Catch(WsException)
export class WsExceptionFilter extends BaseWsExceptionFilter {
  constructor(private readonly socketService: SocketService) {
    super();
  }

  catch(exception: WsException, host: ArgumentsHost) {
    if (!(this.socketService instanceof SocketService)) {
      return;
    }
    const client = host.switchToWs().getClient();
    client.emit('error', exception.message);
  }
}
