
// rollup.config.js
import commonjs from "@rollup/plugin-commonjs";
// import multi from '@rollup/plugin-multi-entry';
import resolve from "@rollup/plugin-node-resolve";
import terser from '@rollup/plugin-terser';
// import merge from 'deepmerge';
import dts from "rollup-plugin-dts";
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from "rollup-plugin-postcss";
import preserveDirectives from 'rollup-plugin-preserve-directives';
import typescript from 'rollup-plugin-typescript2';

// const baseConfig = {
//   input: [
//     'src/functions/**.ts',
//     'src/utils/**.ts',
//     'src/components/**.ts',
//     'src/hooks/**.ts',
//   ],
//   output: [{
//     preserveModules: true,
//     dir: 'dist',
//     format: "esm",
//   }],
//   plugins: [
//     // typescript({ tsconfig: "./tsconfig.json", rootDir: "src" }),
//     // multi({	entryFileName: 'index.js' }),
//     // peerDepsExternal(),
//     // resolve(),
//     // preserveDirectives(),
//     // terser(),
//     // commonjs(),
//   ]
// };

const addConfig = ({ componentName, path, pathCss }) => ({
  input: path,
  output: {
    file: `dist/${componentName}.js`,
    format: 'esm',
  },
  plugins: [
    typescript({ tsconfig: "./tsconfig.json", rootDir: "src" }),
    pathCss ? postcss({ modules: true, extract: true, include: pathCss }) : null,
    peerDepsExternal(),
    resolve(),
    preserveDirectives(),
    terser(),
    commonjs(),
  ]
});

export default [
  addConfig({ componentName: 'Image', path: 'src/components/Image/Image.tsx', pathCss: 'src/components/Image/Image.module.scss' }),
  addConfig({ componentName: 'Video', path: 'src/components/Video/Video.tsx', pathCss: 'src/components/Video/Video.module.scss' }),
  addConfig({ componentName: 'Swiper', path: 'src/components/Swiper/Swiper.tsx', pathCss: 'src/components/Swiper/Swiper.module.scss' }),
  addConfig({ componentName: 'fetchWordpress', path: 'src/functions/fetchWordpress.ts' }),
  addConfig({ componentName: 'draftModeWordpress', path: 'src/functions/draftModeWordpress.ts' }),
  addConfig({ componentName: 'margin', path: 'src/functions/margin.ts' }),
  {
    input: `dist/index.d.ts`,
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts()],
    external: [/\.(css|less|scss)$/],
  }
];

// {
//   input: [
//     'src/**.ts',
//   ],
//   output: [{ file: "dist/index.d.ts", format: "esm" }],
//   plugins: [dts()],
//   external: [/\.(css|less|scss)$/],
// },
