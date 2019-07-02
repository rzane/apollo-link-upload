import gql from "graphql-tag";
import { execute } from "apollo-link";
import { createUploadLink } from "../src/createUploadLink";

const file = new File([], "foo.txt");
const data = { data: { hello: "world" } };

const query = gql`
  mutation Hello {
    foo
  }
`;

const createFetch = (resp: any) => {
  return jest.fn().mockResolvedValue({
    text: jest.fn().mockResolvedValue(JSON.stringify(resp)),
    json: jest.fn().mockResolvedValue(resp)
  });
};

describe("createUploadLink", () => {
  it("sends normal requests as JSON", async () => {
    const next = jest.fn();
    const fetch = createFetch(data);
    const link = createUploadLink({ fetch });
    const observable = execute(link, { query });

    await observable.forEach(data => next(data));

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(data);

    expect(fetch).toHaveBeenCalledWith("/graphql", {
      body:
        '{"operationName":"Hello","variables":{},"query":"mutation Hello {\\n  foo\\n}\\n"}',
      credentials: undefined,
      headers: { accept: "*/*", "content-type": "application/json" },
      method: "POST",
      signal: expect.anything()
    });
  });

  it("sends file upload requests with formdata", async () => {
    const next = jest.fn();
    const fetch = createFetch(data);
    const link = createUploadLink({ fetch });
    const observable = execute(link, {
      query,
      variables: { image: file }
    });

    await observable.forEach(data => next(data));

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(data);

    expect(fetch).toHaveBeenCalledWith("/graphql", {
      body: expect.any(FormData),
      credentials: undefined,
      headers: { accept: "*/*" },
      method: "POST",
      signal: expect.anything()
    });

    const formData: FormData = fetch.mock.calls[0][1].body;
    expect(formData.get("image")).toEqual(file);
    expect(formData.get('query')).toEqual('mutation Hello {\n  foo\n}\n');
    expect(formData.get('variables')).toEqual('{"image":"image"}');
    expect(formData.get("operationName")).toEqual('Hello');
  });
});
