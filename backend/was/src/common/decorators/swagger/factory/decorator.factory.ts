import { API_MSG, CRUD, CrudOperation } from 'src/common/constants/apis';
import {
  DeleteByIdDecorator,
  FindByDecorator,
  FindByWithoutParamDecorator,
  UpdateByIdDecorator,
} from '../decorator';
import { CrudResult, Description, Param } from '../interface';
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
      create200Response(target, CRUD.SELECT, returnType),
      create403Response(),
      create404Response(target),
    );
  }
  return FindByWithoutParamDecorator(
    createSummary(target, CRUD.SELECT),
    create200Response(target, CRUD.SELECT, returnType),
    create403Response(),
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
    create200Response(target, CRUD.UPDATE),
    create403Response(),
    create404Response(target),
  );
}

export function createDeleteByDecorator(target: string, param: Param) {
  return DeleteByIdDecorator(
    param,
    createSummary(target, CRUD.DELETE),
    create200Response(target, CRUD.DELETE),
    create403Response(),
    create404Response(target),
  );
}

function create200Response(
  target: string,
  crud: CrudOperation,
  returnType?: any,
) {
  const okResult: CrudResult = createResult(crud, true);
  const okDescription: Description = createDescription(target, okResult);
  if (!returnType) {
    return createErrorResponse(okDescription);
  }
  return createErrorResponse(okDescription, returnType);
}

function create403Response() {
  return createErrorResponse(API_MSG.FORBIDDEN);
}

function create404Response(target: string) {
  return createErrorResponse(`존재하지 않는 ${target}`);
}
