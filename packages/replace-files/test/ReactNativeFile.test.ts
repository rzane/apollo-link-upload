import { ReactNativeFile } from "../src";

describe("ReactNativeFile", () => {
  const file = new ReactNativeFile({
    name: "foo",
    uri: "bar",
    type: "buzz"
  });

  it("has a name", () => {
    expect(file.name).toEqual("foo");
  });

  it("has a URI", () => {
    expect(file.uri).toEqual("bar");
  });

  it("has a type", () => {
    expect(file.type).toEqual("buzz");
  });
});
