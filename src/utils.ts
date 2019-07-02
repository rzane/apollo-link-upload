import { isFileList } from './files';

export const join = (left: string, right: string | number) => {
  return left ? `${left}.${right}` : right.toString();
};

export const isObject = (value: any) => {
  return value && value.constructor === Object;
};

export const mapValues = (value: any, fn: (v: any, k: string) => any) =>
  Object.entries(value).reduce(
    (acc, [k, v]) => Object.assign(acc, { [k]: fn(v, k) }),
    {}
  );

export const map = (value: any, fn: (v: any, k: string | number) => any) =>
  Array.isArray(value)
    ? value.map(fn)
    : isObject(value)
    ? mapValues(value, fn)
    : isFileList(value)
    ? Array.from(value).map(fn)
    : value;
