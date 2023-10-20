// rollup.config.js
import terser from '@rollup/plugin-terser';
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
// import dts from "rollup-plugin-dts";
import postcss from "rollup-plugin-postcss";
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import multi from '@rollup/plugin-multi-entry';

import pkg from "./package.json" assert { type: 'json' };

export default [
	{
		input: ['src/components/**/*.tsx', 'src/functions/**/*.ts'],
		output: [
			{
				file: pkg.main,
				format: 'cjs',
				sourcemap: true,
			},
			{
				file: pkg.module,
				format: "esm",
				sourcemap: true,
			},
		],
		plugins: [
			peerDepsExternal(),
			resolve(),
			multi(),
			postcss({ modules: true }),
			terser(),
			commonjs(),
			typescript({ tsconfig: "./tsconfig.json" }),
		]
	},
	// {
	// 	input: "dist/esm/types/index.d.ts",
	// 	output: [{ file: "dist/index.d.ts", format: "esm" }],
	// 	plugins: [dts()],
	// 	external: [/\.(css|less|scss)$/],
	// },
];