import { isFileLike } from "../src/utils";
import { ReactNativeFile } from "../src/ReactNativeFile";

describe("isFileLike", () => {
  it("recognizes a file", () => {
    const file = new File([], "foo.txt");
    expect(isFileLike(file)).toBe(true);
  });

  it('recognizes a react native file', () => {
    const file = new ReactNativeFile({ uri: 'foo', name: "bar", type: "buzz" });
    expect(isFileLike(file)).toBe(true);
  });

  it("does not recognize other values", () => {
    expect(isFileLike(1)).toBe(false);
    expect(isFileLike("hi")).toBe(false);
    expect(isFileLike(false)).toBe(false);
    expect(isFileLike(true)).toBe(false);
    expect(isFileLike({})).toBe(false);
    expect(isFileLike([])).toBe(false);
  });
});
