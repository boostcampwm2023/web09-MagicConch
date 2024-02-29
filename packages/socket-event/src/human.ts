import { Server, Socket } from 'socket.io';

interface HumanSocketEvent {
  ServerToClientEvent: {
    connection: (data: {
      description?: RTCSessionDescription | null;
      candidate?: RTCIceCandidate | null;
    }) => void;
    welcome: (otherUsers: any) => void;
    userExit: (data: { id: string }) => void;
    hostExit: () => void;
    roomCreated: () => void;
    roomNameGenerated: (roomId: string) => void;
    joinRoomFailed: () => void;
    joinRoomSuccess: (roomId: string) => void;
    roomExist: () => void;
    roomNotExist: () => void;
    roomFull: () => void;
  };
  ClientToServerEvent: {
    connection: (data: {
      description?: RTCSessionDescription | null;
      candidate?: RTCIceCandidate | null;
      roomName: string;
    }) => void;
    generateRoomName: () => void;
    createRoom: (roomId: string, password: string) => void;
    joinRoom: (roomId: string, password: string) => void;
    checkRoomExist: (roomName: string) => void;
  };
}

export type HumanServer = Server<
  HumanSocketEvent['ClientToServerEvent'],
  HumanSocketEvent['ServerToClientEvent']
>;

export interface HumanSocket
  extends Socket<
    HumanSocketEvent['ClientToServerEvent'],
    HumanSocketEvent['ServerToClientEvent']
  > {}

export type HumanSocketClientEvent =
  keyof HumanSocketEvent['ClientToServerEvent'];

export type HumanSocketClientEventParams<T extends HumanSocketClientEvent> =
  Parameters<HumanSocketEvent['ClientToServerEvent'][T]>;
