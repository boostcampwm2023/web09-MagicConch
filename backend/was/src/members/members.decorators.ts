import { SwaggerDecoratorBuilder } from '@kimyu0218/swagger-decorator-builder';

export const FindMemberByEmailDecorator = (target: string, returnType: any) =>
  new SwaggerDecoratorBuilder(target, 'GET', returnType)
    .removeResponse(403)
    .build();
