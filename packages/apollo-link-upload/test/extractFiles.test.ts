import { extractFiles } from "../src/extractFiles";

class MockFileList {
  private files: File[];

  constructor(files: File[]) {
    this.files = files
  }

  *[Symbol.iterator]() {
    for (const file of this.files) {
      yield file
    }
  }
}

(global as any).FileList = MockFileList;

const file = new File([], "foo.txt");
const fileList = new MockFileList([file]);

describe("extractFiles", () => {
  it("extracts a file", () => {
    expect(extractFiles(file, "data")).toEqual({
      clone: "data",
      files: [{ path: "data", file }]
    });
  });

  it("extracts a list of files", () => {
    expect(extractFiles([file], "data")).toEqual({
      clone: ["data.0"],
      files: [{ path: "data.0", file }]
    });
  });

  it("extracts an object containing files", () => {
    expect(extractFiles({ foo: file })).toEqual({
      clone: { foo: "foo" },
      files: [{ path: "foo", file }]
    });
  });

  it("extracts a FileList", () => {
    expect(extractFiles({ foo: fileList })).toEqual({
      clone: { foo: ["foo.0"] },
      files: [{ path: "foo.0", file }]
    });
  });

  it("extracts a deep object containing files", () => {
    const data = { foo: [{ bar: { buzz: [file] } }] };

    expect(extractFiles(data)).toEqual({
      clone: { foo: [{ bar: { buzz: ["foo.0.bar.buzz.0"] } }] },
      files: [{ file: file, path: "foo.0.bar.buzz.0" }]
    });
  });

  it("does not extract other values", () => {
    expect(extractFiles(1)).toEqual({ files: [], clone: 1 });
    expect(extractFiles("hi")).toEqual({ files: [], clone: "hi" });
  });
});
