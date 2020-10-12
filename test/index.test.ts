import * as index from "../src";

test("exports", () => {
  expect(Object.keys(index).sort()).toEqual([
    "ReactNativeFile",
    "createUploadLink"
  ]);
});
