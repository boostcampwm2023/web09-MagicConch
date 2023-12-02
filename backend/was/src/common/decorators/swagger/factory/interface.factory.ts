import { CrudOperation } from 'src/common/constants/apis';
import {
  Description,
  Param,
  Response,
  Result,
  Summary,
} from 'src/common/decorators/swagger/interface';

export function createSummary(
  target: string,
  operation: CrudOperation,
): Summary {
  return { target, operation };
}

export function createParam(type: string, name: string): Param {
  return { type, name };
}

export function createResult(operation: CrudOperation, result: string): Result {
  return { operation, result };
}

export function createDescription(target: string, result: Result): Description {
  return { target, result };
}

export function createErrorResponse(
  description: Description | string,
  type?: any,
): Response {
  return { description, type };
}
