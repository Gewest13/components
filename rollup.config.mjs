
// rollup.config.js
import terser from '@rollup/plugin-terser';
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from 'rollup-plugin-typescript2';
import dts from "rollup-plugin-dts";
import postcss from "rollup-plugin-postcss";
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import multi from '@rollup/plugin-multi-entry';
import preserveDirectives from 'rollup-plugin-preserve-directives';

import pkg from "./package.json" assert { type: 'json' };

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
			postcss({ modules: true }),
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