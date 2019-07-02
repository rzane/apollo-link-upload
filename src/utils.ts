import { ReactNativeFile } from "./ReactNativeFile";

export type AnyFile = File | Blob | ReactNativeFile;

export const join = (left: string, right: string | number) => {
  return left ? `${left}.${right}` : right.toString();
};

export const isPlainObject = (value: any) => {
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
    : isPlainObject(value)
    ? mapValues(value, fn)
    : isFileList(value)
    ? Array.from(value).map(fn)
    : value;

export const isFileLike = (value: any) =>
  (typeof File !== "undefined" && value instanceof File) ||
  (typeof Blob !== "undefined" && value instanceof Blob) ||
  value instanceof ReactNativeFile;

export const isFileList = (value: any) =>
  typeof FileList !== "undefined" && value instanceof FileList;
