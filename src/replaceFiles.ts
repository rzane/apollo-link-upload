import { ReactNativeFile } from "./ReactNativeFile";

export interface FileLike extends Blob {
  readonly lastModified?: number;
  readonly name?: string;
}

export interface FileInfo {
  path: string;
  file: FileLike | ReactNativeFile;
}

export interface FileReplacementResult {
  data: any;
  files: FileInfo[];
}

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

/**
 * Extract all of the files from the input data.
 */
export const replaceFiles = (
  data: any,
  path: string = ""
): FileReplacementResult => {
  if (isFileLike(data)) {
    const info: FileInfo = { path, file: data };
    return { data: info.path, files: [info] };
  }

  if (Array.isArray(data) || isFileList(data)) {
    const result: FileReplacementResult = { data: [], files: [] };

    for (let i = 0; i < data.length; i++) {
      const innerPath = path ? `${path}.${i}` : i.toString();
      const inner = replaceFiles(data[i], innerPath);
      result.data.push(inner.data);
      result.files.push(...inner.files);
    }

    return result;
  }

  if (isObject(data)) {
    const result: FileReplacementResult = { data: {}, files: [] };

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const innerPath = path ? `${path}.${key}` : key.toString();
        const inner = replaceFiles(data[key], innerPath);
        result.data[key] = inner.data;
        result.files.push(...inner.files);
      }
    }

    return result;
  }

  return { data, files: [] };
};
