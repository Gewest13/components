
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

const components = [
  { name: 'Image', css: true },
  { name: 'Video', css: true },
  { name: 'Swiper', css: true },
  { name: 'ColumnsContainer', css: true },
  { name: 'SharedFormConfirmation', css: true },
  { name: 'SharedTypography' },
  { name: 'SharedLink' },
  { name: 'ButtonTemplate' },
  { name: 'SharedForm' },
  { name: 'RecaptchaV3' },
]

const functions = [
  { name: 'fetchWordpress' },
  { name: 'draftModeWordpress' },
  { name: 'margin' },
  { name: 'wpMail' },
  { name: 'getRelationshipData' },
]

const hooks = [
  { name: 'useWindowSize' },
  { name: 'useRender' }
]

const utils = [
  { name: 'lerp' },
  { name: 'capitalizeFirstLetter' },
  { name: 'lowerCaseFirstLetter' },
  { name: 'removeTrailingSlashUrl' },
  { name: 'calcPercentage' },
  { name: 'isTouchDevice' },
  { name: 'asyncTimeout' },
  { name: 'sanitizeString' },
  { name: 'removeHTMLTags' },
  { name: 'convertParagraphToBreaks' },
]

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
  ...components.map(({ name, css }) => addConfig({ componentName: name, path: `src/components/${name}/${name}.tsx`, pathCss: css ? `src/components/${name}/${name}.module.scss` : null })),
  ...components.map(({ name }) => addDeclaration({ componentName: name, pathTs: `dist/components/${name}/${name}.d.ts` })),
  ...functions.map(({ name }) => addConfig({ componentName: name, path: `src/functions/${name}.ts` })),
  ...functions.map(({ name }) => addDeclaration({ componentName: name, pathTs: `dist/functions/${name}.d.ts` })),
  ...hooks.map(({ name }) => addConfig({ componentName: name, path: `src/hooks/${name}.tsx` })),
  ...hooks.map(({ name }) => addDeclaration({ componentName: name, pathTs: `dist/hooks/${name}.d.ts` })),
  ...utils.map(({ name }) => addConfig({ componentName: name, path: `src/utils/${name}.ts` })),
  ...utils.map(({ name }) => addDeclaration({ componentName: name, pathTs: `dist/utils/${name}.d.ts` })),
  {
    input: `dist/index.d.ts`,
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts()],
    external: [/\.(css|less|scss)$/],
  }
];
