
// rollup.config.js
import commonjs from "@rollup/plugin-commonjs";
import multi from '@rollup/plugin-multi-entry';
import resolve from "@rollup/plugin-node-resolve";
import terser from '@rollup/plugin-terser';
import dts from "rollup-plugin-dts";
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from "rollup-plugin-postcss";
import preserveDirectives from 'rollup-plugin-preserve-directives';
import typescript from 'rollup-plugin-typescript2';

export default [
  {
    input: 'src/index.ts',
    output: [{
      preserveModules: true,
      dir: 'dist',
      format: "esm",
    }],
    plugins: [
      typescript({ tsconfig: "./tsconfig.json", rootDir: "src" }),
      multi({	entryFileName: 'index.js' }),
      peerDepsExternal(),
      resolve(),
      postcss({ modules: true, extract: true }),
      preserveDirectives(),
      terser(),
      commonjs(),
    ]
  },
  {
    input: "dist/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts()],
    external: [/\.(css|less|scss)$/],
  },
];