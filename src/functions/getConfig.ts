/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import defaultData from '../../config';

let config: any;

try {
  config = require('config');
  console.log(config);
} catch (error) {
  // Handle the error or provide default data
  config = defaultData;
}

export const getConfig = config;