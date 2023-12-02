import { API_MSG, CRUD, CrudOperation } from 'src/common/constants/apis';
import {
  DeleteByIdDecorator,
  FindByDecorator,
  FindByWithoutParamDecorator,
  UpdateByIdDecorator,
} from '../decorator';
import { Description, Param, Result } from '../interface';
import {
  createDescription,
  createErrorResponse,
  createResult,
  createSummary,
} from './interface.factory';

export function createFindByDecorator(
  target: string,
  returnType: any,
  param?: Param,
) {
  if (param) {
    return FindByDecorator(
      param,
      createSummary(target, CRUD.SELECT),
      createOkResponse(target, CRUD.SELECT, returnType),
      createErrorResponse(API_MSG.UNAUTH),
      createErrorResponse(`존재하지 않는 ${target}`),
    );
  }
  return FindByWithoutParamDecorator(
    createSummary(target, CRUD.SELECT),
    createOkResponse(target, CRUD.SELECT, returnType),
    createErrorResponse(API_MSG.UNAUTH),
  );
}

export function createUpdateByDecorator(
  target: string,
  param: Param,
  body: any,
) {
  return UpdateByIdDecorator(
    param,
    body,
    createSummary(target, CRUD.UPDATE),
    createOkResponse(target, CRUD.UPDATE),
    createErrorResponse(API_MSG.FORBIDDEN),
    createErrorResponse(`존재하지 않는 ${target}`),
  );
}

export function createDeleteByDecorator(target: string, param: Param) {
  return DeleteByIdDecorator(
    param,
    createSummary(target, CRUD.DELETE),
    createOkResponse(target, CRUD.DELETE),
    createErrorResponse(API_MSG.FORBIDDEN),
    createErrorResponse(`존재하지 않는 ${target}`),
  );
}

function createOkResponse(
  target: string,
  crud: CrudOperation,
  returnType?: any,
) {
  const okResult: Result = createResult(crud, '성공');
  const okDescription: Description = createDescription(target, okResult);
  if (!returnType) {
    return createErrorResponse(okDescription);
  }
  return createErrorResponse(okDescription, returnType);
}
