'use server';

import { cookies, draftMode } from 'next/headers';
import { NextResponse } from 'next/server';

import { fetchWordpress } from './fetchWordpress';

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

  if (!pageData.contentNode || !token) {
    const loginData = await fetchWordpress({ api_url, query: loginMutation, variables: { input: { username, password } } });

    if (loginData.errors) {
      return NextResponse.json({ message: 'Wrong username or password.' }, secureHeaderOptions);
    }

    const newToken = loginData.login.authToken;

    draftMode().enable();
    return NextResponse.redirect(`${origin}${pageData.contentNode.uri}`, {
      status: 307,
      headers: { 'Set-Cookie': `token=${newToken}; SameSite=Strict; Secure; Expires=${oneHourFromNow.toUTCString()}` },
    });
  }

  draftMode().enable();
  return NextResponse.redirect(`${origin}${pageData.contentNode.uri}`, {
    status: 307,
    headers: { 'Set-Cookie': `token=${token}; SameSite=Strict; Secure; Expires=${oneHourFromNow.toUTCString()}` },
  });
};
