import replace from "rollup-plugin-replace";
import babel from "rollup-plugin-babel";
import uglify from "@lopatnov/rollup-plugin-uglify";

const NODE_ENV = process.env.NODE_ENV || "production";

export default {
  input: "./src/index.js",
  output: {
    file: "dist/index.js",
    format: "cjs",
    compact: true,
    minifyInternalExports: true,
  },
  plugins: [
    replace({ "process.env.NODE_ENV": JSON.stringify(NODE_ENV) }),
    babel({ exclude: "node_modules/**", runtimeHelpers: true }),
    uglify(),
  ],
  external: (id) => /^react/.test(id),
};
