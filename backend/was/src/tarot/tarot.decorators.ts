import {
  SwaggerDecoratorBuilder,
  SwaggerParam,
} from '@kimyu0218/swagger-decorator-builder';

export const FindTarotCardDecorator = (
  target: string,
  param: SwaggerParam,
  returnType: any,
) =>
  new SwaggerDecoratorBuilder(target, 'GET', returnType)
    .setParam(param)
    .remove(403)
    .build();

export const FindTarotResultDecorator = (
  target: string,
  param: SwaggerParam,
  returnType: any,
) =>
  new SwaggerDecoratorBuilder(target, 'GET', returnType)
    .setParam(param)
    .remove(401)
    .remove(403)
    .build();
