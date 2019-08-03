import { replaceFiles, FilePath } from "replace-files";
import { ApolloLink, Observable } from "apollo-link";
import {
  Body,
  serializeFetchParameter,
  selectURI,
  parseAndCheckHttpResponse,
  selectHttpOptionsAndBody,
  fallbackHttpConfig,
  HttpOptions,
  createSignalIfSupported
} from "apollo-link-http-common";

/**
 * A wrapper around a file. This is important to
 * indicate that the object is *definitely* a file.
 */
export { ReactNativeFile } from "replace-files";

/**
 * Conver the request body to FormData
 */
const serializeFormData = (body: Body, files: FilePath[]) => {
  const form = new FormData();

  if (body.operationName) {
    form.append("operationName", body.operationName);
  }

  if (body.query) {
    form.append("query", body.query);
  }

  if (body.variables) {
    const variables = serializeFetchParameter(body.variables, "Variables");
    form.append("variables", variables);
  }

  if (body.extensions) {
    const extensions = serializeFetchParameter(
      body.extensions,
      "Extensions map"
    );
    form.append("extensions", extensions);
  }

  files.forEach(({ path, file }) => {
    form.append(path, file as File, (file as File).name);
  });

  return form;
};

/**
 * Creates a terminating link that will convert the variables
 * into form data if the request contains any files.
 */
export const createUploadLink = ({
  uri: fetchUri = "/graphql",
  fetch: fetcher = fetch,
  fetchOptions,
  credentials,
  headers,
  includeExtensions
}: HttpOptions = {}) => {
  const linkConfig = {
    http: { includeExtensions },
    options: fetchOptions,
    credentials,
    headers
  };

  return new ApolloLink(operation => {
    const uri = selectURI(operation, fetchUri);
    const context = operation.getContext();
    const contextConfig = {
      http: context.http,
      options: context.fetchOptions,
      credentials: context.credentials,
      headers: context.headers
    };

    const { options, body } = selectHttpOptionsAndBody(
      operation,
      fallbackHttpConfig,
      linkConfig,
      contextConfig
    );

    const { clone, files } = replaceFiles(body);

    if (files.length) {
      delete options.headers["content-type"];
      options.body = serializeFormData(clone, files);
    } else {
      options.body = serializeFetchParameter(body, "Payload");
    }

    return new Observable(observer => {
      // Allow aborting fetch, if supported.
      const { controller, signal } = createSignalIfSupported();
      if (controller) {
        options.signal = signal;
      }

      fetcher(uri, options)
        .then(response => {
          // Forward the response on the context.
          operation.setContext({ response });
          return response;
        })
        .then(parseAndCheckHttpResponse(operation))
        .then(result => {
          observer.next(result);
          observer.complete();
        })
        .catch(error => {
          if (error.name === "AbortError") {
            // Fetch was aborted.
            return;
          }

          if (error.result && error.result.errors && error.result.data) {
            // There is a GraphQL result to forward.
            observer.next(error.result);
          }

          observer.error(error);
        });

      // Cleanup function.
      return () => {
        // Abort fetch.
        if (controller) controller.abort();
      };
    });
  });
};
