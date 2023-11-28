import fs from 'fs';
import path from 'path';

export type FetchWordpress = {
  api_url: string;
  query: string;
  token?: string;
  noGetRequest?: boolean;
  debug?: boolean;
  performanceLog?: boolean;
  variables?: {
    [key: string]: string | {
      [key: string]: string;
    }
  };
};

export const fetchWordpress = async ({ api_url, query, variables, token, noGetRequest, debug, performanceLog }: FetchWordpress) => {
  const headers: any = {
    'Content-Type': 'application/json',
  };

  let response;

  if (debug) {
    const logData = `Debug fetch wordpress: ${api_url}, ${query}, ${JSON.stringify(variables)}\n`;

    const logFilePath = path.join(__dirname, 'debug.log');

    fs.appendFile(logFilePath, logData, (err) => {
      if (err) throw err;
      console.log(`Debug information has been written to ${logFilePath}`);
    });
  }

  const startTime = Date.now();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (noGetRequest || token) {
    response = await fetch(api_url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
    });
  } else {
    response = await fetch(`${api_url}?query=${query}`, {
      method: 'GET',
      headers,
    });
  }

  const json = await response.json();

  if (performanceLog) {
    console.log(`Fetch Wordpress: ${Date.now() - startTime}ms`);
  }

  if (json.errors) {
    return json;
  }

  return json.data;
};