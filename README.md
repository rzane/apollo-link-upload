# apollo-link-upload [![Build Status](https://travis-ci.org/rzane/apollo-link-upload.svg?branch=master)](https://travis-ci.org/rzane/apollo-link-upload) [![Greenkeeper badge](https://badges.greenkeeper.io/rzane/apollo-link-upload.svg)](https://greenkeeper.io/)

This package can be used to perform file uploads. It is compatible with Absinthe and GraphQL::Extras.

### Features

* Written in TypeScript.
* Simple server-side implementation.
* Support for `FileList` and multiple file uploads.
* Supports React Native.

### Supported Backends

* [Absinthe](https://hexdocs.pm/absinthe_plug/Absinthe.Plug.Types.html)
* [GraphQL::Extras](https://github.com/rzane/graphql-extras)

## Usage

```javascript
import ApolloClient from "apollo-client";
import { createUploadLink } from "apollo-link-upload";

const client = new ApolloClient({
  link: createUploadLink({ uri: "/graphql" })
});
```

### React Native

Values submitted in React Native will only be recognized as a file if it is an instance of `ReactNativeFile`.

```javascript
import { ReactNativeFile } from "apollo-link-upload";

const file = new ReactNativeFile({
  uri: "something",
  name: 'a.jpg',
  type: 'image/jpeg'
})
```

## Similar Packages

* [`apollo-upload-client`](https://github.com/jaydenseric/apollo-upload-client)
* [`apollo-absinthe-upload-link`](https://github.com/bytewitchcraft/apollo-absinthe-upload-link)

## Contributing

To install dependencies:

    $ yarn install

To run the test suite:

    $ yarn test
