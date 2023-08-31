export interface ActionWrapper<T> {
  error_code: number;
  result: T;
}