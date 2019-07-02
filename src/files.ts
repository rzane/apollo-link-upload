export type AnyFile = File | Blob;

export const isFileLike = (value: any): value is AnyFile =>
  (typeof File !== "undefined" && value instanceof File) ||
  (typeof Blob !== "undefined" && value instanceof Blob);

export const isFileList = (value: any): value is FileList =>
  typeof FileList !== "undefined" && value instanceof FileList;
