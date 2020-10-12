import { fromError, Observable, ApolloLink } from "@apollo/client/core";
import {
  HttpOptions,
  checkFetcher,
  createSignalIfSupported,
  fallbackHttpConfig,
  parseAndCheckHttpResponse,
  rewriteURIForGET,
  selectHttpOptionsAndBody,
  selectURI,
  serializeFetchParameter
} from "@apollo/client/link/http";

import { replaceFiles } from "./replaceFiles";
import { serializeFormData } from "./serializeFormData";

export function createUploadLink(linkOptions: HttpOptions = {}): ApolloLink {
  let {
    uri = "/graphql",
    fetch: fetcher,
    includeExtensions,
    useGETForQueries,
    ...requestOptions
  } = linkOptions;

  checkFetcher(fetcher);

  if (!fetcher) {
    fetcher = fetch;
  }

  const linkConfig = {
    http: { includeExtensions },
    options: requestOptions.fetchOptions,
    credentials: requestOptions.credentials,
    headers: requestOptions.headers
  };

  return new ApolloLink(operation => {
    let chosenURI = selectURI(operation, uri);

    const context = operation.getContext();
    const clientAwarenessHeaders: {
      "apollographql-client-name"?: string;
      "apollographql-client-version"?: string;
    } = {};

    if (context.clientAwareness) {
      const { name, version } = context.clientAwareness;
      if (name) {
        clientAwarenessHeaders["apollographql-client-name"] = name;
      }
      if (version) {
        clientAwarenessHeaders["apollographql-client-version"] = version;
      }
    }

    const contextHeaders = { ...clientAwarenessHeaders, ...context.headers };

    const contextConfig = {
      http: context.http,
      options: context.fetchOptions,
      credentials: context.credentials,
      headers: contextHeaders
    };

    const { options, body } = selectHttpOptionsAndBody(
      operation,
      fallbackHttpConfig,
      linkConfig,
      contextConfig
    );

    const { data, files } = replaceFiles(body); // ADDED: Extract the files

    let controller: any;
    if (!(options as any).signal) {
      const { controller: _controller, signal } = createSignalIfSupported();
      controller = _controller;
      if (controller) (options as any).signal = signal;
    }

    const definitionIsMutation = (d: any) => {
      return d.kind === "OperationDefinition" && d.operation === "mutation";
    };
    if (
      useGETForQueries &&
      !operation.query.definitions.some(definitionIsMutation) &&
      !files.length // ADDED: Must send a POST if we have files
    ) {
      options.method = "GET";
    }

    if (options.method === "GET") {
      const { newURI, parseError } = rewriteURIForGET(chosenURI, body);
      if (parseError) {
        return fromError(parseError);
      }
      chosenURI = newURI;
    } else {
      try {
        // ADDED: Send request as multipart if we have files
        if (files.length) {
          delete options.headers["content-type"];
          options.body = serializeFormData(data, files);
        } else {
          options.body = serializeFetchParameter(body, "Payload");
        }
      } catch (parseError) {
        return fromError(parseError);
      }
    }

    return new Observable(observer => {
      fetcher!(chosenURI, options)
        .then(response => {
          operation.setContext({ response });
          return response;
        })
        .then(parseAndCheckHttpResponse(operation))
        .then(result => {
          observer.next(result);
          observer.complete();
          return result;
        })
        .catch(err => {
          if (err.name === "AbortError") return;
          if (err.result && err.result.errors && err.result.data) {
            observer.next(err.result);
          }
          observer.error(err);
        });

      return () => {
        if (controller) controller.abort();
      };
    });
  });
}
