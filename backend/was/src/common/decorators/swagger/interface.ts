import { CrudOperation } from 'src/common/constants/apis';

export interface Summary {
  target: string;
  operation: CrudOperation;
}

export interface Param {
  type: string;
  name: string;
}

export interface Result {
  operation: CrudOperation;
  result: string;
}

export interface Description {
  target: string;
  result: Result;
}

export interface Response {
  description: Description | string;
  type?: any;
}
