import { SwaggerDecoratorBuilder } from '@kimyu0218/swagger-decorator-builder';
import { ApiBodyOptions, ApiParamOptions } from '@nestjs/swagger';

export const FindRoomsDecorator = (target: string, returnType: any) =>
  new SwaggerDecoratorBuilder(target, 'GET', returnType)
    .removeResponse(401)
    .removeResponse(404)
    .build();

export const FindMessagesDecorator = (
  target: string,
  param: ApiParamOptions,
  returnType: any,
) =>
  new SwaggerDecoratorBuilder(target, 'GET', returnType)
    .addParam(param)
    .removeResponse(401)
    .build();

export const UpdateRoomDecorator = (
  target: string,
  param: ApiParamOptions,
  body: ApiBodyOptions,
) =>
  new SwaggerDecoratorBuilder(target, 'PATCH')
    .addParam(param)
    .setBody(body)
    .removeResponse(401)
    .build();

export const DeleteRoomDecorator = (target: string, param: ApiParamOptions) =>
  new SwaggerDecoratorBuilder(target, 'DELETE')
    .addParam(param)
    .removeResponse(401)
    .build();
