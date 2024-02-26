import { ApiParamOptions } from '@nestjs/swagger';
import { SwaggerDecoratorBuilder } from '@kimyu0218/swagger-decorator-builder';

export const FindTarotCardDecorator = (
  target: string,
  param: ApiParamOptions,
  returnType: any,
) =>
  new SwaggerDecoratorBuilder(target, 'GET', returnType)
    .addParam(param)
    .removeResponse(401)
    .removeResponse(403)
    .addResponse(400)
    .build();

export const FindTarotResultDecorator = (
  target: string,
  param: ApiParamOptions,
  returnType: any,
) =>
  new SwaggerDecoratorBuilder(target, 'GET', returnType)
    .addParam(param)
    .removeResponse(401)
    .removeResponse(403)
    .addResponse(400)
    .build();
