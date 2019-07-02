import { isFileLike } from "../src/utils";

const file = new File([], "foo.txt");

describe("isFileLike", () => {
  it("recognizes a file", () => {
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
