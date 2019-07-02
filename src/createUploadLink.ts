import { extractFiles } from "./extractFiles";
import { serializeFormData } from "./serializeFormData";
import { ApolloLink, Observable } from "apollo-link";
import {
  serializeFetchParameter,
  selectURI,
  parseAndCheckHttpResponse,
  selectHttpOptionsAndBody,
  fallbackHttpConfig,
  HttpOptions,
  createSignalIfSupported
} from "apollo-link-http-common";

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

    const extracted = extractFiles(body.variables);

    if (extracted.files.length) {
      delete options.headers["content-type"];

      options.body = serializeFormData({
        ...body,
        variables: extracted.clone,
        files: extracted.files
      });
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
