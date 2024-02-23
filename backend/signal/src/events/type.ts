import { Server, Socket } from 'socket.io';

export type HumanServer = Server<
  HumanSocketEvent['ClientToServerEvent'],
  HumanSocketEvent['ServerToClientEvent']
>;

export type HumanSocket = Socket<
  HumanSocketEvent['ClientToServerEvent'],
  HumanSocketEvent['ServerToClientEvent']
>;

export type HumanSocketClientEvent =
  keyof HumanSocketEvent['ClientToServerEvent'];

export type HumanSocketClientEventParams<T extends HumanSocketClientEvent> =
  Parameters<HumanSocketEvent['ClientToServerEvent'][T]>;
