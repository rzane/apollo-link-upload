export interface ReactNativeFileOptions {
  uri: string;
  name: string;
  type: string;
}

export class ReactNativeFile {
  public readonly uri: string;
  public readonly name: string;
  public readonly type: string;

  constructor({ uri, name, type }: ReactNativeFileOptions) {
    this.uri = uri;
    this.name = name;
    this.type = type;
  }
}
