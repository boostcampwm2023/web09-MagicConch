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
import { Description, Param, Response, Result, Summary } from './interface';

export const FindByWithoutParamDecorator = (
  summary: Summary,
  ok: Response,
  unauth: Response,
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
  summary: Summary,
  ok: Response,
  unauth: Response,
  notfound: Response,
) => {
  return applyDecorators(
    ApiOperation({ summary: getSummary(summary) }),
    ApiParam({ type: param.type, name: param.name }),
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
  summary: Summary,
  ok: Response,
  forbidden: Response,
  notfound: Response,
) => {
  return applyDecorators(
    ApiOperation({ summary: getSummary(summary) }),
    ApiParam({ type: param.type, name: param.name }),
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
  summary: Summary,
  ok: Response,
  forbidden: Response,
  notfound: Response,
) => {
  return applyDecorators(
    ApiOperation({ summary: getSummary(summary) }),
    ApiParam({ type: param.type, name: param.name }),
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

function getSummary(summary: Summary): string {
  return `${summary.target} ${summary.operation} API`;
}

function getResult(result: Result): string {
  return `${result.operation} ${result.result}`;
}

function getResponseDescription(
  responseDescription: Description | string,
): string {
  return typeof responseDescription === 'string'
    ? responseDescription
    : `${responseDescription.target} ${getResult(responseDescription.result)}`;
}
