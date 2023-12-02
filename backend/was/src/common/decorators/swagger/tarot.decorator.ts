import { createFindByDecorator } from './factory/decorator.factory';
import { Param } from './interface';

export const FindTarotCardDecorator = (
  target: string,
  returnType: any,
  param: Param,
) => {
  return createFindByDecorator(target, returnType, param);
};

export const FindTarotResultDecorator = (
  target: string,
  returnType: any,
  param: Param,
) => {
  return createFindByDecorator(target, returnType, param);
};
