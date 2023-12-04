import { createFindByDecorator } from './factory/decorator.factory';
import { Param } from './interface';

export const FindTarotCardDecorator = (
  target: string,
  param: Param,
  returnType: any,
) => {
  return createFindByDecorator(target, returnType, param);
};

export const FindTarotResultDecorator = (
  target: string,
  param: Param,
  returnType: any,
) => {
  return createFindByDecorator(target, returnType, param);
};
