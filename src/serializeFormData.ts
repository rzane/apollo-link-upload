import { Body, serializeFetchParameter } from "apollo-link-http-common";
import { ExtractFile } from "./extractFiles";

export interface UploadBody extends Body {
  files: ExtractFile[];
}

export const serializeFormData = (body: UploadBody) => {
  const form = new FormData();

  if (body.operationName) {
    form.append("operationName", body.operationName);
  }

  if (body.query) {
    form.append("query", body.query);
  }

  if (body.variables) {
    const variables = serializeFetchParameter(body.variables, "Variables")
    form.append("variables", variables);
  }

  if (body.extensions) {
    const extensions = serializeFetchParameter(body.extensions, "Extensions map")
    form.append("extensions", extensions);
  }

  body.files.forEach(({ path, file}) => {
    form.append(path, file)
  });

  return form;
};
