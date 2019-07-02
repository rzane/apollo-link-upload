import { map, join } from './utils';
import { AnyFile, isFileLike } from './files';

export interface ExtractFile {
  path: string;
  file: AnyFile;
}

export interface ExtractFiles {
  value: any;
  files: ExtractFile[];
}

export const extractFiles = (value: any, path: string = ''): ExtractFiles => {
  if (isFileLike(value)) {
    return { value: path, files: [{ path, file: value }] };
  }

  const files: ExtractFile[] = [];
  const nextValue = map(value, (v, k) => {
    const result = extractFiles(v, join(path, k));
    files.push(...result.files);
    return result.value;
  });

  return { value: nextValue, files };
};
