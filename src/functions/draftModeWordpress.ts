import { NextResponse } from "next/server";
import { cookies, draftMode } from 'next/headers';

export type FetchWordpress = {
  api_url: string;
  query: string;
  token?: string;
  variables?: any;
};

export const fetchWordpress = async ({ api_url, query, variables, token }: FetchWordpress) => {
  const startDate = new Date().getTime();

  const response = await fetch(api_url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ query, variables }),
  });

  const endDate = new Date().getTime();
  console.log('Execution time', `${endDate - startDate}ms`);

  const json = await response.json();

  return json.data;
};

const loginMutation = `
  mutation LoginUser($input: LoginInput!) {
    login(input: $input) {
      authToken,
      refreshToken,
      user {
        id
        name
      }
    }
  }
`;

const checkIfPrivateSlugExists = `
  query CheckIfSlugExists($id: ID!) {
    contentNode(id: $id, idType: DATABASE_ID) {
      contentTypeName
      id
      uri
    }
  }
`;

const secureHeaderOptions = {
  status: 401,
  headers: {
    'WWW-Authenticate': 'Basic realm="Secure Area"',
  },
};

export const draftModeWordpress = async (api_url: string, req: Request) => {
  const { searchParams, origin } = new URL(req.url);
  const { disable, username, password, uri: id } = Object.fromEntries(searchParams);

  if (disable) {
    draftMode().disable();
    return NextResponse.json({ message: 'Preview mode disabled' }, { status: 200 });
  }

  if (!username || !password) {
    return NextResponse.json({ message: 'No password or username provided' }, secureHeaderOptions);
  }

  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  const pageData = await fetchWordpress({ api_url, query: checkIfPrivateSlugExists, variables: { id }, token });
  const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);

  if (!pageData || !token) {
    const loginData = await fetchWordpress({ api_url, query: loginMutation, variables: { input: { username, password } }});

    if (loginData.errors) {
      console.log('Error login');
      return NextResponse.json({ message: 'Wrong username or password.' }, secureHeaderOptions);
    }

    const newToken = loginData.data.login.authToken;

    draftMode().disable();
    return NextResponse.redirect(`${origin}${pageData.contentNode.uri}`, {
      status: 307,
      headers: { 'Set-Cookie': `token=${newToken}; HttpOnly; Secure; SameSite=Strict; Expires=${oneHourFromNow.toUTCString()}`,},
    });
  }

  draftMode().enable();

  return NextResponse.redirect(`${origin}${pageData.contentNode.uri}`, {
    status: 307,
    headers: { 'Set-Cookie': `token=${token}; HttpOnly; Secure; SameSite=Strict; Expires=${oneHourFromNow.toUTCString()}`,},
  });
};