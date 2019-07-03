import * as index from "../src";

test("exports", () => {
  expect(Object.keys(index)).toEqual(["ReactNativeFile", "createUploadLink"]);
});
