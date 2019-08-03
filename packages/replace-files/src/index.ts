export interface FilePath {
  path: string;
  file: File | Blob | ReactNativeFile;
}

export interface FileReplacements {
  clone: any;
  files: FilePath[];
}

export interface ReactNativeFileOptions {
  uri?: string;
  name?: string;
  type?: string;
}

/**
 * A wrapper around a file. This is important to
 * indicate that the object is *definitely* a file.
 */
export class ReactNativeFile {
  public readonly uri: string | undefined;
  public readonly name: string | undefined;
  public readonly type: string | undefined;

  constructor({ uri, name, type }: ReactNativeFileOptions) {
    this.uri = uri;
    this.name = name;
    this.type = type;
  }
}

/**
 * Utilities
 */

const isObject = (value: any) => value && value.constructor === Object;

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
    : isObject(value)
    ? mapValues(value, fn)
    : isFileList(value)
    ? Array.from(value).map(fn)
    : value;

/**
 * Extract all of the files from the input data.
 */
export const replaceFiles = (
  variables: any,
  path: string = ""
): FileReplacements => {
  if (isFileLike(variables)) {
    return { clone: path, files: [{ path, file: variables }] };
  }

  const files: FilePath[] = [];
  const clone = map(variables, (v, k) => {
    const inner = replaceFiles(v, join(path, k));
    files.push(...inner.files);
    return inner.clone;
  });

  return { clone, files };
};
