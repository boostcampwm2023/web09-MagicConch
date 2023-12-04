import {
  createDeleteByDecorator,
  createFindByDecorator,
  createUpdateByDecorator,
} from './factory/decorator.factory';
import { Param } from './interface';

export const FindRoomsDecorator = (target: string, returnType: any) => {
  return createFindByDecorator(target, returnType);
};

export const FindMessagesDecorator = (
  target: string,
  param: Param,
  returnType: any,
) => {
  return createFindByDecorator(target, returnType, param);
};

export const UpdateRoomDecorator = (
  target: string,
  param: Param,
  body: any,
) => {
  return createUpdateByDecorator(target, param, body);
};

export const DeleteRoomDecorator = (target: string, param: Param) => {
  return createDeleteByDecorator(target, param);
};
