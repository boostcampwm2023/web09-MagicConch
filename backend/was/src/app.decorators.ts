import { SwaggerDecoratorBuilder } from '@kimyu0218/swagger-decorator-builder';

export const HealthCheckDecorator = () =>
  new SwaggerDecoratorBuilder()
    .setOperation({ summary: '도커 컨테이너를 실행할 때 헬스체크용 API' })
    .removeResponse(401)
    .removeResponse(403)
    .removeResponse(404)
    .build();
