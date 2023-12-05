import { transports } from 'winston';

export const debugTransports: transports.ConsoleTransportInstance =
  new transports.Console({
    level: 'debug',
  });