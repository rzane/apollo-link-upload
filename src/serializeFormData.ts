import { FileInfo } from "./replaceFiles";
import { serializeFetchParameter } from "@apollo/client/link/http";
import type { Body } from "@apollo/client/link/http/selectHttpOptionsAndBody";

/**
 * Convert the request body to FormData
 */
export function serializeFormData(body: Body, files: FileInfo[]): FormData {
  const form = new FormData();

  if (body.operationName) {
    form.append("operationName", body.operationName);
  }

  if (body.query) {
    form.append("query", body.query);
  }

  if (body.variables) {
    form.append(
      "variables",
      serializeFetchParameter(body.variables, "Variables")
    );
  }

  if (body.extensions) {
    form.append(
      "extensions",
      serializeFetchParameter(body.extensions, "Extensions map")
    );
  }

  files.forEach(({ path, file }) => {
    form.append(path, file as any, file.name);
  });

  return form;
}
