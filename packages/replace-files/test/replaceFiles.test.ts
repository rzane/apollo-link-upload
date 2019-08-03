import { replaceFiles } from "../src";
import { MockFileList } from "./setup";

const file = new File([], "foo.txt");
const fileList = new MockFileList([file]);

describe("replaceFiles", () => {
  it("replaces a file", () => {
    expect(replaceFiles(file, "data")).toEqual({
      data: "data",
      files: [{ path: "data", file }]
    });
  });

  it("replaces a list of files", () => {
    expect(replaceFiles([file], "data")).toEqual({
      data: ["data.0"],
      files: [{ path: "data.0", file }]
    });
  });

  it("replaces an object containing files", () => {
    expect(replaceFiles({ foo: file })).toEqual({
      data: { foo: "foo" },
      files: [{ path: "foo", file }]
    });
  });

  it("replaces a FileList", () => {
    // sanity check
    expect(fileList).toBeInstanceOf(FileList);

    expect(replaceFiles({ foo: fileList })).toEqual({
      data: { foo: ["foo.0"] },
      files: [{ path: "foo.0", file }]
    });
  });

  it("replaces a deep object containing files", () => {
    const data = { foo: [{ bar: { buzz: [file] } }] };

    expect(replaceFiles(data)).toEqual({
      data: { foo: [{ bar: { buzz: ["foo.0.bar.buzz.0"] } }] },
      files: [{ file: file, path: "foo.0.bar.buzz.0" }]
    });
  });

  it("does not extract other values", () => {
    expect(replaceFiles(1)).toEqual({ files: [], data: 1 });
    expect(replaceFiles("hi")).toEqual({ files: [], data: "hi" });
  });
});
