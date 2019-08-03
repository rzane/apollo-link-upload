const { replaceFiles } = require("./lib");

/**
 * Stub globals
 */

global.File = function File() {};

/**
 * The number of iterations.
 */
const count = 1000000;

/**
 * Input data.
 */
const file = new File();

const data = {
  foo: { bar: [null, { foo: 1 }, [file, file]] },
  bar: [1, 2, 3, 4, 5, { file }]
};

/**
 * Run the iterations.
 */
console.time("replaceFiles");
for (var i = 0; i < count; i++) {
  replaceFiles(data);
}
console.timeEnd("replaceFiles");
