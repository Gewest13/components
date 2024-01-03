import fs from 'fs';
import path from 'path';

export type FetchWordpress = {
  api_url: string;
  query: string;
  token?: string;
  noGetRequest?: boolean;
  debug?: boolean;
  performanceLog?: boolean;
  revalidateTag?: any;
  disableError?: boolean;
  variables?: any;
};

export const fetchWordpress = async ({ api_url, query, variables, token, noGetRequest, debug, performanceLog , revalidateTag, disableError }: FetchWordpress) => {
  const headers: any = {
    'Content-Type': 'application/json',
  };

  const next =  { revalidate: 60, tags: revalidateTag ? [revalidateTag.toString()] : undefined }

  let response;

  if (debug) {
    const time = new Date().toISOString();
    const logData = `Debug fetch wordpress ${time}: ${api_url}, ${query}, ${JSON.stringify(variables)}\n`;

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
    response = await (fetch as any)(api_url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
      next
    });
  } else {
    response = await (fetch as any)((`${api_url}?query=${query}${variables ? `&variables=${JSON.stringify(variables)}` : ''}`).replace(/\s+/g, ' ').replace(/\t/g, '').trim(), {
      method: 'GET',
      headers,
      next,
    });
  }

  const json = await response.json();

  if (performanceLog) {
    console.log(`Fetch Wordpress: ${Date.now() - startTime}ms`);
  }

  if (json.errors) {
    if (disableError) return json.data;

    throw json.errors;
  }

  return json.data;
};