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
  public readonly uri: string;
  public readonly name: string;
  public readonly type: string;

  constructor(opts: ReactNativeFileOptions) {
    this.uri = opts.uri;
    this.name = opts.name;
    this.type = opts.type;
  }
}
