import { map, join, isFileLike } from "./utils";
import { ReactNativeFile } from './ReactNativeFile';

export interface ExtractFile {
  path: string;
  file: File | Blob | ReactNativeFile;
}

export interface ExtractFiles {
  clone: any;
  files: ExtractFile[];
}

export const extractFiles = (variables: any, path: string = ""): ExtractFiles => {
  if (isFileLike(variables)) {
    return { clone: path, files: [{ path, file: variables }] };
  }

  const files: ExtractFile[] = [];
  const clone = map(variables, (v, k) => {
    const result = extractFiles(v, join(path, k));
    files.push(...result.files);
    return result.clone;
  });

  return { clone, files };
};
