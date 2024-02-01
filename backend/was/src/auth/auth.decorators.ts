import { SwaggerDecoratorBuilder } from '@kimyu0218/swagger-decorator-builder';

export const AuthenticateDecorator = () =>
  new SwaggerDecoratorBuilder()
    .setOperation({ summary: '로그인 여부 확인' })
    .removeResponse(401)
    .removeResponse(403)
    .removeResponse(404)
    .build();

export const KakaoLoginDecorator = () =>
  new SwaggerDecoratorBuilder()
    .setOperation({ summary: '카카오 로그인' })
    .addQuery({
      name: 'code',
      type: 'string',
      description: '카카오 로그인의 인가 코드',
    })
    .removeResponse(403)
    .removeResponse(404)
    .addResponse(400)
    .build();

export const LogoutDecorator = () =>
  new SwaggerDecoratorBuilder()
    .setOperation({ summary: '로그아웃' })
    .removeResponse(403)
    .removeResponse(404)
    .addResponse(400)
    .build();
