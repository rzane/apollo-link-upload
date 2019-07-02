import { map, join } from "./utils";
import { AnyFile, isFileLike } from "./files";

export interface ExtractFile {
  path: string;
  file: AnyFile;
}

export interface ExtractFiles {
  variables: any;
  files: ExtractFile[];
}

export const extractFiles = (variables: any, path: string = ""): ExtractFiles => {
  if (isFileLike(variables)) {
    return { variables: path, files: [{ path, file: variables }] };
  }

  const files: ExtractFile[] = [];
  const mapped = map(variables, (v, k) => {
    const result = extractFiles(v, join(path, k));
    files.push(...result.files);
    return result.variables;
  });

  return { variables: mapped, files };
};
