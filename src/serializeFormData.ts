import { FilePath } from "./extractFiles";
import { Body, serializeFetchParameter } from "apollo-link-http-common";

export interface UploadBody extends Body {
  files: FilePath[];
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
    form.append(path, file as File, (file as File).name)
  });

  return form;
};
