// export const draftModeWordpress = async (api_url: string, req: Request) => {
//   const { searchParams, origin } = new URL(req.url);
//   const { disable, username, password, uri: id } = Object.fromEntries(searchParams);

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import nodemailer from 'nodemailer';

import { fetchWordpress } from "./fetchWordpress";


const getAllPrivateSettings = `
  query GetAllPrivateSettings {
    allPrivateSettings(where: {status: PRIVATE}) {
      nodes {
        acfPrivate {
          recaptcha {
            secretKey
            siteKey {
              ... on Recaptcha {
                title
              }
            }
          }
          smtp {
            smtpAccounts {
              password
              smtpAccount {
                ... on Smtp {
                  databaseId
                  acfSmtp {
                    port
                    secure
                    pool
                    server
                    username
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

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

interface TPrivateSettings {
  recaptcha: {
    secretKey: string;
    siteKey: {
      title: string;
    };
  };
  smtp: {
    smtpAccounts: {
      password: string;
      smtpAccount: {
        databaseId: string;
        acfSmtp: {
          port: number;
          server: string;
          username: string;
          secure: boolean;
          pool: boolean;
        };
      };
    }[];
  };
}

interface IpostWpMail {
  api_url: string;
  WORDPRESS_USERNAME: string;
  WORDPRESS_PASSWORD: string;
}

interface IbodyMail {
  mail_reciever_id: string;
  mail: { [key: string]: string };
  subject: string;
  confirmationMail: string;
  confirmationMailReciever: string;
  mail_sender_id: string;
  mail_subject: string;
  recaptcha: string;
}

async function sendNodeMailer(
  transporter: nodemailer.Transporter,
  mailData: nodemailer.SendMailOptions,
): Promise<nodemailer.SentMessageInfo> {
  try {
    const info = await transporter.sendMail(mailData);
    console.log(info);
    return info;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const fetchToken =  async ({ WORDPRESS_USERNAME, WORDPRESS_PASSWORD, api_url }: IpostWpMail) => {
  const result = await fetch(api_url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: loginMutation,
      variables: {
        input: {
          username: WORDPRESS_USERNAME,
          password: WORDPRESS_PASSWORD,
        },
      },
    }),
  });

  const { data } = await result.json();

  return data.login.authToken;
}

const fetchPrivateSettings = async ({ api_url, token }: { token: string, api_url: string }) => {
  const data = await fetchWordpress({ api_url, query: getAllPrivateSettings, token, noGetRequest: true, disableError: true });

  return data;
}



export const postWpMail = async ({ api_url, req, WORDPRESS_USERNAME, WORDPRESS_PASSWORD }: IpostWpMail & { req: Request }) => {
  const body = await req.json();

  const {
    mail_reciever_id,
    mail,
    subject,
    confirmationMail,
    mail_sender_id,
    mail_subject,
    recaptcha,
    confirmationMailReciever,
  } = body as IbodyMail;

  const cookieStore = cookies();

  // fetch token from cookie
  let token = String(cookieStore.get('token')?.value);

  // if token does not exist try to fetch new token
  if (!token) {
    token = await fetchToken({ api_url, WORDPRESS_USERNAME, WORDPRESS_PASSWORD });
  }

  // if token exist try to fetch private settings (would be the fastest way)
  let data = await fetchPrivateSettings({ api_url, token });

  // if token is invalid try to fetch new token (this will happen if the token is expired)
  if (!data.login) {
    token = await fetchToken({ api_url, WORDPRESS_USERNAME, WORDPRESS_PASSWORD });
    data = await fetchPrivateSettings({ api_url, token });
  }

  // if data is still invalid return error (this will hapen if password or username is wrong)
  if (!data.login) {
    return NextResponse.json({ message: 'Wordpress username of password is wrong.' }, { status: 500 });
  }

  const formattedData = data.allPrivateSettings.nodes[0].acfPrivate;
  const privateSettings: TPrivateSettings = formattedData;

  // Important otherwise no mail will be sent
  const getSmtpAccountMailSender = privateSettings.smtp.smtpAccounts.find(
    ({ smtpAccount }) => smtpAccount.databaseId === mail_sender_id,
  );

  // Important otherwise the mail reciever will not get any emails
  // We will use filter here since more than one mail reciever can be used
  const getSmtpAccountMailReciever = privateSettings.smtp.smtpAccounts.filter(
    ({ smtpAccount }) => smtpAccount.databaseId === mail_reciever_id,
  );

  if (!getSmtpAccountMailSender) {
    return NextResponse.json({ message: `SMTP account mail reciever not found. Check under SMTP accounts if a post with ${mail_sender_id} ID exist.` }, { status: 500 });
  }

  if (!getSmtpAccountMailReciever) {
    return NextResponse.json({ message: `SMTP account mail sender not found. Check under SMTP accounts if a post with ${mail_reciever_id} ID exist.` }, { status: 500 });
  }

  const {
    password: SENDER_MAIL_PASSWORD,
    smtpAccount: {
      acfSmtp: {
        secure: SENDER_MAIL_SECURE,
        pool: SENDER_MAIL_POOL,
        port: SENDER_MAIL_PORT,
        server: SENDER_MAIL_SERVER,
        username: SENDER_MAIL_USERNAME,
      },
    },
  } = getSmtpAccountMailSender!;

  if (!SENDER_MAIL_PASSWORD || !SENDER_MAIL_PORT || !SENDER_MAIL_SERVER || !SENDER_MAIL_USERNAME) {
    return NextResponse.json({ message: `Missing SMTP account mail sender data. Please check if all fields are filled out on post type: ${mail_sender_id}` }, { status: 500 });
  }

  const sender = (nodemailer as any).createTransport({
    port: SENDER_MAIL_PORT,
    host: SENDER_MAIL_SERVER,
    pool: SENDER_MAIL_POOL,
    secure: SENDER_MAIL_SECURE,
    auth: {
      user: SENDER_MAIL_USERNAME,
      pass: SENDER_MAIL_PASSWORD,
    },
  });

  try {
    await sender.verify();
    console.log('Server is ready to take our messages');
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error, message: 'Something went wrong. Please contact the site administrator.' }, { status: 500 },
    );
  }

  const messageReciever = confirmationMailReciever.replace(/{{(.+?)}}/g, (_match, p1) => mail[p1]);
  const messageConfirmation = confirmationMail.replace(/{{(.+?)}}/g, (_match, p1) => mail[p1]);

  const RECAPTCHA_SECRET_KEY = privateSettings.recaptcha.secretKey;

  const mailData = {
    from: SENDER_MAIL_USERNAME,
    to: getSmtpAccountMailReciever.map(({ smtpAccount }) => smtpAccount.acfSmtp.username),
    subject: mail_subject,
    text: messageConfirmation,
    html: messageConfirmation,
  };

  const clientData = {
    from: SENDER_MAIL_USERNAME,
    to: mail.email,
    subject,
    html: messageReciever,
  };

  try {
    if (RECAPTCHA_SECRET_KEY) {
      const recaptchaRes = await fetch( `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${recaptcha}`,{ method: 'POST', },);
      const json = await recaptchaRes.json();

      if (json.success !== undefined && !json.success) {
        return NextResponse.json({ error: 'Bot detected', message: 'Something went wrong. Please contact the site administrator.' }, { status: 500 });
      }
    }

    // First send mail to reciever
    await sendNodeMailer(sender, clientData);
    // Then send mail to sender
    await sendNodeMailer(sender, mailData);

    return NextResponse.json({ message: 'The mail was successfully sent.' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, message: 'Something went wrong. Please contact the site administrator.' }, { status: 500 });
  }
}

export const testWpMail = async ({ api_url, req, WORDPRESS_PASSWORD, WORDPRESS_USERNAME }: IpostWpMail & { req: Request }) => {
  const { searchParams } = new URL(req.url);
  const { id, email_reciever } = Object.fromEntries(searchParams);

  const body = {
    mail_reciever_id: id,
    mail: {
      email: email_reciever,
      name: 'Test',
      message: 'Test',
    },
    subject: 'Test',
    confirmationMail: 'Test',
    confirmationMailReciever: 'Test',
    mail_sender_id: id,
    mail_subject: 'Test',
    recaptcha: 'Test',
  };

  return postWpMail({
    api_url, WORDPRESS_PASSWORD, WORDPRESS_USERNAME,
    req: { json: () => Promise.resolve({ body }) } as any,
  });
}

