/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import defaultData from '../../config';
import path from 'path';

const rootConfigPath = path.join(__dirname, 'config.js');

let config;

try {
  config = require(rootConfigPath);
  console.log(config);
} catch (error) {
  // Handle the error or provide default data
  config = defaultData;
}

export default config as any;