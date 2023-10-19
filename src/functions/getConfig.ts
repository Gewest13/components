/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import defaultData from '../../config';

let config;

try {
  config = require('../../../../../config.js');
} catch (error) {
  // Handle the error or provide default data
  config = defaultData
}

export default config as any;
