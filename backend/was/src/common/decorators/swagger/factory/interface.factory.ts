import { CrudOperation } from 'src/common/constants/apis';
import {
  CrudResult,
  Description,
  OperationSummary,
  Param,
  SwaggerResponse,
} from 'src/common/decorators/swagger/interface';

export function createSummary(
  target: string,
  operation: CrudOperation,
): OperationSummary {
  return { target, operation };
}

export function createParam(type: string, name: string): Param {
  return { type, name };
}

export function createResult(
  operation: CrudOperation,
  succeed: boolean,
): CrudResult {
  return { operation, succeed };
}

export function createDescription(
  target: string,
  result: CrudResult,
): Description {
  return { target, result };
}

export function createErrorResponse(
  description: Description | string,
  type?: any,
): SwaggerResponse {
  return { description, type };
}
