import { extractFiles, isFileLike } from '../src';

const file = new File([], 'foo.txt');

describe('isFileLike', () => {
  it('recognizes a file', () => {
    expect(isFileLike(file)).toBe(true);
  });

  it('does not recognize other values', () => {
    expect(isFileLike(1)).toBe(false);
    expect(isFileLike('hi')).toBe(false);
    expect(isFileLike(false)).toBe(false);
    expect(isFileLike(true)).toBe(false);
    expect(isFileLike({})).toBe(false);
    expect(isFileLike([])).toBe(false);
  });
});

describe('extractFiles', () => {
  it('extracts a file', () => {
    expect(extractFiles(file, 'data')).toEqual({
      value: 'data',
      files: [{ path: 'data', file }],
    });
  });

  it('extracts a list of files', () => {
    expect(extractFiles([file], 'data')).toEqual({
      value: ['data.0'],
      files: [{ path: 'data.0', file }],
    });
  });

  it('does not extract other values', () => {
    expect(extractFiles(1)).toEqual({ files: [], value: 1 });
    expect(extractFiles('hi')).toEqual({ files: [], value: 'hi' });
  });
});
