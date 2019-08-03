/**
 * There is no way to construct a `FileList` instance.
 * So, we'll make our own.
 */
export class MockFileList implements FileList {
  length: number;
  [index: number]: File;

  constructor(private files: File[]) {
    this.length = files.length;

    for (let i = 0; i < files.length; i++) {
      this[i] = files[i];
    }
  }

  item(index: number) {
    return this.files[index];
  }

  *[Symbol.iterator]() {
    for (const file of this.files) {
      yield file;
    }
  }
}

/**
 * Replace the real FileList
 */
(window as any).FileList = MockFileList;
