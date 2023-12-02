import { CrudOperation } from 'src/common/constants/apis';

export interface OperationSummary {
  target: string;
  operation: CrudOperation;
}

export interface Param {
  type: string;
  name: string;
}

export interface CrudResult {
  operation: CrudOperation;
  succeed: boolean;
}

export interface Description {
  target: string;
  result: CrudResult;
}

export interface SwaggerResponse {
  description: Description | string;
  type?: any;
}
