export interface ReactNativeFileOptions {
  uri?: string;
  name?: string;
  type?: string;
}

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
