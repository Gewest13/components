
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

const baseConfig = {
  input: [
    'src/index.ts',
  ],
  output: [{
    preserveModules: true,
    dir: 'dist',
    format: "esm",
  }],
  plugins: [
    typescript({ tsconfig: "./tsconfig.json", rootDir: "src" }),
    multi({	entryFileName: 'index.js' }),
    peerDepsExternal(),
    postcss({ modules: true, extract: true }),
    resolve(),
    preserveDirectives(),
    terser(),
    commonjs(),
  ]
};

const addConfig = ({ componentName, path, pathCss }) => ({
  input: path,
  output: {
    file: `dist/${componentName}.js`,
    format: 'esm',
  },
  plugins: [
    typescript(),
    pathCss ? postcss({ modules: true, extract: true, include: pathCss }) : null,
    peerDepsExternal(),
    resolve(),
    preserveDirectives(),
    terser(),
    commonjs(),
  ],
});

const addDeclaration = ({ pathTs, componentName }) => ({
  input: pathTs,
  output: [{ file: `dist/${componentName}.d.ts`, format: "esm" }],
  plugins: [dts()],
  external: [/\.(css|less|scss)$/],
});

export default [
  baseConfig,
  addConfig({ componentName: 'Image', path: 'src/components/Image/Image.tsx', pathCss: 'src/components/Image/Image.module.scss' }),
  addConfig({ componentName: 'Video', path: 'src/components/Video/Video.tsx', pathCss: 'src/components/Video/Video.module.scss' }),
  addConfig({ componentName: 'Swiper', path: 'src/components/Swiper/Swiper.tsx', pathCss: 'src/components/Swiper/Swiper.module.scss' }),
  addConfig({ componentName: 'ColumnsContainer', path: 'src/components/ColumnsContainer/ColumnsContainer.tsx', pathCss: 'src/components/ColumnsContainer/ColumnsContainer.module.scss' }),
  addConfig({ componentName: 'SharedForm', path: 'src/components/SharedForm/SharedForm.tsx' }),
  addConfig({ componentName: 'RecaptchaV3', path: 'src/components/RecaptchaV3/RecaptchaV3.tsx' }),
  addConfig({ componentName: 'fetchWordpress', path: 'src/functions/fetchWordpress.ts' }),
  addConfig({ componentName: 'draftModeWordpress', path: 'src/functions/draftModeWordpress.ts' }),
  addConfig({ componentName: 'margin', path: 'src/functions/margin.ts' }),
  addConfig({ componentName: 'wpMail', path: 'src/functions/wpMail.ts' }),
  addDeclaration({ componentName: 'Image', pathTs: 'dist/components/Image/Image.d.ts' }),
  addDeclaration({ componentName: 'Video', pathTs: 'dist/components/Video/Video.d.ts' }),
  addDeclaration({ componentName: 'Swiper', pathTs: 'dist/components/Swiper/Swiper.d.ts' }),
  addDeclaration({ componentName: 'ColumnsContainer', pathTs: 'dist/components/ColumnsContainer/ColumnsContainer.d.ts' }),
  addDeclaration({ componentName: 'SharedForm', pathTs: 'dist/components/SharedForm/SharedForm.d.ts' }),
  addDeclaration({ componentName: 'RecaptchaV3', pathTs: 'dist/components/RecaptchaV3/RecaptchaV3.d.ts' }),
  addDeclaration({ componentName: 'fetchWordpress', pathTs: 'dist/functions/fetchWordpress.d.ts' }),
  addDeclaration({ componentName: 'draftModeWordpress', pathTs: 'dist/functions/draftModeWordpress.d.ts' }),
  addDeclaration({ componentName: 'margin', pathTs: 'dist/functions/margin.d.ts' }),
  addDeclaration({ componentName: 'wpMail', pathTs: 'dist/functions/wpMail.d.ts' }),
  {
    input: `dist/index.d.ts`,
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts()],
    external: [/\.(css|less|scss)$/],
  }
];
