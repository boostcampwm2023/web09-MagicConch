import { applyDecorators } from '@nestjs/common/decorators';
import {
  ApiBody,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  CrudResult,
  Description,
  OperationSummary,
  Param,
  SwaggerResponse,
} from './interface';

export const FindByWithoutParamDecorator = (
  summary: OperationSummary,
  ok: SwaggerResponse,
  unauth: SwaggerResponse,
) => {
  return applyDecorators(
    ApiOperation({ summary: getSummary(summary) }),
    ApiOkResponse({
      description: getResponseDescription(ok.description),
      type: ok.type,
    }),
    ApiUnauthorizedResponse({
      description: getResponseDescription(unauth.description),
    }),
    ApiInternalServerErrorResponse(),
  );
};

export const FindByDecorator = (
  param: Param,
  summary: OperationSummary,
  ok: SwaggerResponse,
  unauth: SwaggerResponse,
  notfound: SwaggerResponse,
) => {
  return applyDecorators(
    ApiOperation({ summary: getSummary(summary) }),
    ApiParam(param),
    ApiOkResponse({
      description: getResponseDescription(ok.description),
      type: ok.type,
    }),
    ApiUnauthorizedResponse({
      description: getResponseDescription(unauth.description),
    }),
    ApiNotFoundResponse({
      description: getResponseDescription(notfound.description),
    }),
    ApiInternalServerErrorResponse(),
  );
};

export const UpdateByIdDecorator = (
  param: Param,
  body: any,
  summary: OperationSummary,
  ok: SwaggerResponse,
  forbidden: SwaggerResponse,
  notfound: SwaggerResponse,
) => {
  return applyDecorators(
    ApiOperation({ summary: getSummary(summary) }),
    ApiParam(param),
    ApiBody({ type: body }),
    ApiOkResponse({
      description: getResponseDescription(ok.description),
      type: ok.type,
    }),
    ApiForbiddenResponse({
      description: getResponseDescription(forbidden.description),
    }),
    ApiNotFoundResponse({
      description: getResponseDescription(notfound.description),
    }),
    ApiInternalServerErrorResponse(),
  );
};

export const DeleteByIdDecorator = (
  param: Param,
  summary: OperationSummary,
  ok: SwaggerResponse,
  forbidden: SwaggerResponse,
  notfound: SwaggerResponse,
) => {
  return applyDecorators(
    ApiOperation({ summary: getSummary(summary) }),
    ApiParam(param),
    ApiOkResponse({
      description: getResponseDescription(ok.description),
      type: ok.type,
    }),
    ApiForbiddenResponse({
      description: getResponseDescription(forbidden.description),
    }),
    ApiNotFoundResponse({
      description: getResponseDescription(notfound.description),
    }),
    ApiInternalServerErrorResponse(),
  );
};

function getSummary(summary: OperationSummary): string {
  return `${summary.target} ${summary.operation} API`;
}

function getCrudResult(result: CrudResult): string {
  return `${result.operation} ${result.succeed ? '성공' : '실패'}`;
}

function getResponseDescription(
  responseDescription: Description | string,
): string {
  return typeof responseDescription === 'string'
    ? responseDescription
    : `${responseDescription.target} ${getCrudResult(
        responseDescription.result,
      )}`;
}
