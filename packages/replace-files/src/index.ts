export interface FileLike extends Blob {
  readonly lastModified?: number;
  readonly name?: string;
}

export interface FileInfo {
  path: string;
  file: FileLike | ReactNativeFile;
}

export type Replacer = (info: FileInfo) => any;

export interface Result {
  data: any;
  files: FileInfo[];
}

export interface ReactNativeFileOptions {
  uri: string;
  name: string;
  type: string;
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

const isFileLike = (value: any) =>
  (typeof File !== "undefined" && value instanceof File) ||
  (typeof Blob !== "undefined" && value instanceof Blob) ||
  value instanceof ReactNativeFile;

const isFileList = (value: any) => {
  return typeof FileList !== "undefined" && value instanceof FileList;
};

const isObject = (value: any) => {
  return value !== null && typeof value === "object";
};

const defaultReplacer: Replacer = info => info.path;

/**
 * Extract all of the files from the input data.
 */
export const replaceFiles = (
  data: any,
  replace: Replacer = defaultReplacer,
  path: string = ""
): Result => {
  if (isFileLike(data)) {
    const info: FileInfo = { path, file: data };
    return { data: replace(info), files: [info] };
  }

  if (Array.isArray(data) || isFileList(data)) {
    const result: Result = { data: [], files: [] };

    for (let i = 0; i < data.length; i++) {
      const innerPath = path ? `${path}.${i}` : i.toString();
      const inner = replaceFiles(data[i], replace, innerPath);
      result.data.push(inner.data);
      result.files.push(...inner.files);
    }

    return result;
  }

  if (isObject(data)) {
    const result: Result = { data: {}, files: [] };

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const innerPath = path ? `${path}.${key}` : key.toString();
        const inner = replaceFiles(data[key], replace, innerPath);
        result.data[key] = inner.data;
        result.files.push(...inner.files);
      }
    }

    return result;
  }

  return { data, files: [] };
};
