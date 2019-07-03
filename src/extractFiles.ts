import { ReactNativeFile } from "./ReactNativeFile";

export interface FilePath {
  path: string;
  file: File | Blob | ReactNativeFile;
}

export interface ExtractFiles {
  clone: any;
  files: FilePath[];
}

const isPlainObject = (value: any) => value && value.constructor === Object;

const isFileLike = (value: any) =>
  (typeof File !== "undefined" && value instanceof File) ||
  (typeof Blob !== "undefined" && value instanceof Blob) ||
  value instanceof ReactNativeFile;

const isFileList = (value: any) =>
  typeof FileList !== "undefined" && value instanceof FileList;

const join = (left: string, right: string | number) =>
  left ? `${left}.${right}` : right.toString();

const mapValues = (value: any, fn: (v: any, k: string) => any) =>
  Object.entries(value).reduce(
    (acc, [k, v]) => Object.assign(acc, { [k]: fn(v, k) }),
    {}
  );

const map = (value: any, fn: (v: any, k: string | number) => any) =>
  Array.isArray(value)
    ? value.map(fn)
    : isPlainObject(value)
    ? mapValues(value, fn)
    : isFileList(value)
    ? Array.from(value).map(fn)
    : value;

export const extractFiles = (variables: any, path: string = ""): ExtractFiles => {
  if (isFileLike(variables)) {
    return { clone: path, files: [{ path, file: variables }] };
  }

  const files: FilePath[] = [];
  const clone = map(variables, (v, k) => {
    const inner = extractFiles(v, join(path, k));
    files.push(...inner.files);
    return inner.clone;
  });

  return { clone, files };
};
