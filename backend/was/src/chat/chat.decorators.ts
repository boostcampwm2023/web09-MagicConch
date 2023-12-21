import {
  SwaggerBody,
  SwaggerDecoratorBuilder,
  SwaggerParam,
} from '@kimyu0218/swagger-decorator-builder';

export const FindRoomsDecorator = (target: string, returnType: any) =>
  new SwaggerDecoratorBuilder(target, 'GET', returnType)
    .remove(401)
    .remove(404)
    .build();

export const FindMessagesDecorator = (
  target: string,
  param: SwaggerParam,
  returnType: any,
) =>
  new SwaggerDecoratorBuilder(target, 'GET', returnType)
    .remove(401)
    .setParam(param)
    .build();

export const UpdateRoomDecorator = (
  target: string,
  param: SwaggerParam,
  body: SwaggerBody,
) =>
  new SwaggerDecoratorBuilder(target, 'PATCH')
    .setParam(param)
    .setBody(body)
    .remove(401)
    .build();

export const DeleteRoomDecorator = (target: string, param: SwaggerParam) =>
  new SwaggerDecoratorBuilder(target, 'DELETE')
    .setParam(param)
    .remove(401)
    .build();
