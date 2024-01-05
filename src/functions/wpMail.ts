/* eslint-disable @typescript-eslint/ban-ts-comment */

import Handlebars  from 'handlebars';
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import nodemailer from 'nodemailer';
import isEmail from 'validator/es/lib/isEmail';

import { fetchWordpress } from "./fetchWordpress";

// Register custom block helper for date comparison
Handlebars.registerHelper('isDateAfter', function (dateString, options) {
  // @ts-ignore
  return new Date().getTime() > new Date(dateString).getTime() ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper('isDateBefore', function (dateString, options) {
  // @ts-ignore
  return new Date().getTime() < new Date(dateString).getTime() ? options.fn(this) : options.inverse(this);
});

// Register custom block helper for time comparison with UTC offset
Handlebars.registerHelper('isTimeAfter', function (timeString, utcOffset, options) {
  const currentTime = new Date().toLocaleTimeString('en-US', { timeZone: 'UTC' });
  const targetTime = new Date(`1970-01-01T${timeString}+00:00`);
  targetTime.setHours(targetTime.getHours() + utcOffset);
  // @ts-ignore
  return currentTime > targetTime.toLocaleTimeString('en-US', { timeZone: 'UTC' }) ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper('isTimeBefore', function (timeString, utcOffset, options) {
  const currentTime = new Date().toLocaleTimeString('en-US', { timeZone: 'UTC' });
  const targetTime = new Date(`1970-01-01T${timeString}+00:00`);
  targetTime.setHours(targetTime.getHours() + utcOffset);
  // @ts-ignore
  return currentTime < targetTime.toLocaleTimeString('en-US', { timeZone: 'UTC' }) ? options.fn(this) : options.inverse(this);
});

// Register custom block helpers for time of day
Handlebars.registerHelper('isMorning', function (options) {
  const currentHour = new Date().getHours();
  // @ts-ignore
  return currentHour >= 6 && currentHour < 12 ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper('isAfternoon', function (options) {
  const currentHour = new Date().getHours();
  // @ts-ignore
  return currentHour >= 12 && currentHour < 18 ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper('isEvening', function (options) {
  const currentHour = new Date().getHours();
  // @ts-ignore
  return currentHour >= 18 && currentHour < 24 ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper('isNight', function (options) {
  const currentHour = new Date().getHours();
  // @ts-ignore
  return currentHour >= 0 && currentHour < 6 ? options.fn(this) : options.inverse(this);
});

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

interface propsPrivateSettings {
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

export interface wpMailResponse {
  translationKey:
  'success' |
  'sending' |
  'invalidEmail' |
  'error' |
  'unauthorized' |
  'noPrivateSettings' |
  'noSender' |
  'noReceiver' |
  'bot';
  message: string;
  error?: string;
}

interface propsPostWpMail {
  api_url: string;
  wordpress_username: string;
  wordpress_password: string;
  debug?: boolean;
}

export interface EmailBody {
  /** Key-value pairs representing the content of the email */
  mail: { [key: string]: string };

  /** Information about the sender */
  transporter: {
    databaseId: string | number; // Unique identifier for the sender
  };

  /** Extra confirmation data for the client */
  dataReceiver: {
    usernames: string[]; // Array of unique identifiers for data retrieval
    subject: string; // Subject for data retrieval
    previewText: string; // Preview text for data retrieval
    content: string; // Content for data retrieval
  };

  sender: string; // Email address of confirmation email sender

  senderEnvelope: string; // Email address of form submitter

  /** Details for the confirmation email */
  confirmation?: {
    subject?: string; // Subject for the confirmation email
    previewText?: string; // Preview text for the confirmation email
    html?: string; // Content for the confirmation email
    plainText?: string; // Content for the confirmation email
    // Deprecated, please render emailTemplate on the server side on the project it self. This will safe a render each time a mail is sent.
    // This approach is more sustainable and will save resources for the client and the server. 🌱
    // Send the emailTemplate as content
    // emailTemplate?: any; // React component for the confirmation email
  };

  /** Recaptcha response string */
  recaptcha?: string;

  /** Optional secret key for additional security (may be undefined) */
  secretKey?: string;
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

const fetchToken = async ({ wordpress_username, wordpress_password, api_url }: propsPostWpMail) => {
  const result = await fetch(api_url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: loginMutation,
      variables: {
        input: {
          username: wordpress_username,
          password: wordpress_password,
        },
      },
    }),
  });

  const { data } = await result.json();

  return data.login.authToken;
};

const fetchPrivateSettings = async ({ api_url, token, disableError }: { token: string, api_url: string, disableError?: boolean }) => {
  const data = await fetchWordpress({ api_url, query: getAllPrivateSettings, token, noGetRequest: true, disableError });

  return data;
};

export const postWpMail = async ({ api_url, req, wordpress_username, wordpress_password, debug }: propsPostWpMail & { req: Request }) => {
  const body = await req.json();

  const {
    mail,
    recaptcha,
    secretKey,
    transporter,
    dataReceiver,
    confirmation,
    senderEnvelope,
    sender,
  } = body as EmailBody;

  if (confirmation?.plainText?.length && confirmation.html?.length) {
    if (!isEmail(mail.email)) {
      return NextResponse.json({
        translationKey: 'invalidEmail',
        message: 'The email is invalid.',
      } as wpMailResponse,
      { status: 500 });
    }
  }

  const cookieStore = cookies();

  // fetch token from cookie
  let token = cookieStore.get('token')?.value as string;

  // if token does not exist try to fetch new token
  if (!token) {
    token = await fetchToken({ api_url, wordpress_username, wordpress_password });
    console.log(token);
  }

  // if token exist try to fetch private settings (would be the fastest way)
  let data = await fetchPrivateSettings({ api_url, token, disableError: true });

  if (debug) console.log(data);

  // if token is invalid try to fetch new token (this will happen if the token is expired)
  if (!data.allPrivateSettings) {
    token = await fetchToken({ api_url, wordpress_username, wordpress_password });
    data = await fetchPrivateSettings({ api_url, token, disableError: false });
  }

  // if data is still invalid return error (this will happen if password or username is wrong)
  if (!data.allPrivateSettings) {
    return NextResponse.json({
      translationKey: 'unauthorized',
      message: 'Something went wrong logging in the wordpress',
      error: JSON.stringify(data)
    } as wpMailResponse,
    { status: 401 });
  }

  if (!data.allPrivateSettings.nodes.length || !data.allPrivateSettings.nodes[0] || !data.allPrivateSettings.nodes[0].acfPrivate) {
    return NextResponse.json({
      translationKey: 'noPrivateSettings',
      message: 'No private settings found. Please create a private settings inside the wordpress.',
    } as wpMailResponse,
    { status: 500 });
  }

  const formattedData = data.allPrivateSettings.nodes[0].acfPrivate;
  const privateSettings: propsPrivateSettings = formattedData;

  const RECAPTCHA_SECRET_KEY = privateSettings.recaptcha.secretKey;

  if (RECAPTCHA_SECRET_KEY && secretKey !== RECAPTCHA_SECRET_KEY) {
    const recaptchaRes = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${recaptcha}`, { method: 'POST' });
    const json = await recaptchaRes.json();

    if (json.success !== undefined && !json.success) {
      return NextResponse.json({
        translationKey: 'bot',
        error: JSON.stringify(json),
        message: 'Something went wrong. Please contact the site administrator.',
      } as wpMailResponse,
      { status: 500 });
    }
  }

  // Important otherwise no mail will be sent
  const getSmtpAccountMailSender = privateSettings.smtp.smtpAccounts.find(({ smtpAccount }) => String(smtpAccount.databaseId) === String(transporter.databaseId));

  // Important otherwise the mail receiver will not get any emails
  // We will use filter here since more than one mail receiver can be used
  const getSmtpAccountMailReceiver = dataReceiver.usernames;

  if (!getSmtpAccountMailSender) {
    return NextResponse.json({ message: `SMTP account mail receiver not found. Check under SMTP accounts if a post with ${transporter.databaseId} ID exist.` }, { status: 500 });
  }

  if (!getSmtpAccountMailReceiver.length) {
    return NextResponse.json({
      translationKey: 'noReceiver',
      message: `SMTP account mail sender not found. Check under SMTP accounts if a post with ${dataReceiver.usernames[0]} ID exist.`
    } as wpMailResponse,
    { status: 500 });
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
    return NextResponse.json({
      translationKey: 'noSender',
      message: `Missing SMTP account mail sender data. Please check if all fields are filled out on post type: ${transporter.databaseId}`,
    } as wpMailResponse,
    { status: 500 });
  }

  const transport = (nodemailer as any).createTransport({
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
    await transport.verify();
    console.log('Server is ready to take our messages');
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      translationKey: 'error',
      message: 'Something went wrong. Please contact the site administrator.',
      error,
    } as wpMailResponse,
    { status: 500 });
  }

  let messageSubject = '';
  let confirmationHtml = '';
  let confirmationPlainText = '';

  if (confirmation?.subject) {
    try {
      messageSubject = Handlebars.compile(confirmation.subject)(mail);
    } catch (error) {
      messageSubject = 'Something went wrong with the Handlebar variables: ' + confirmation.subject;
    }
  }

  if (confirmation?.html) {
    try {
      confirmationHtml = Handlebars.compile(confirmation.html)(mail);
    } catch (error) {
      confirmationHtml = 'Something went wrong with the Handlebar variables: ' + confirmation.html;
    }
  }

  if (confirmation?.plainText) {
    try {
      confirmationPlainText = Handlebars.compile(confirmation.plainText)(mail);
    } catch (error) {
      confirmationPlainText = 'Something went wrong with the Handlebar variables: ' + confirmation.plainText;
    }
  }

  if (debug) console.log('getSmtpAccountMailReceiver', getSmtpAccountMailReceiver);

  let messageRecipientSubject = '';
  let messageRecipient = '';

  if (dataReceiver.subject) {
    try {
      messageRecipientSubject = Handlebars.compile(dataReceiver.subject)(mail);
    } catch (error) {
      messageRecipientSubject = 'Something went wrong with the Handlebar variables: ' + dataReceiver.subject;
    }
  }

  if (dataReceiver.content) {
    try {
      messageRecipient = Handlebars.compile(dataReceiver.content)(mail);
    } catch (error) {
      messageRecipient = 'Something went wrong with the Handlebar variables: ' + dataReceiver.content;
    }
  }

  let handlebarsSenderEnvelope = '';

  if (senderEnvelope) {
    try {
      handlebarsSenderEnvelope = Handlebars.compile(senderEnvelope)(mail);
    } catch (error) {
      handlebarsSenderEnvelope = 'Something went wrong with the Handlebar variables: ' + senderEnvelope;
    }
  }

  const mailData = {
    from: handlebarsSenderEnvelope,
    to: getSmtpAccountMailReceiver,
    subject: messageRecipientSubject,
    html: messageRecipient,
  };

  const clientData = {
    from: sender,
    to: mail.email,
    subject: messageSubject,
    text: confirmationPlainText,
    html: confirmationHtml,
  };

  try {
    // First send mail to receiver
    if (confirmationHtml.length && confirmationPlainText.length && mail.email) {
      await sendNodeMailer(transport, clientData)
    }
    // Then send mail to sender
    await sendNodeMailer(transport, mailData);

    const oneMonthFromNow = new Date(Date.now() + 60 * 60 * 1000 * 24 * 30);

    return NextResponse.json({
      translationKey: 'success',
      message: 'The mail was successfully sent.'
    } as wpMailResponse,
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `token=${token}; HttpOnly; Secure; SameSite=Strict; Expires=${oneMonthFromNow.toUTCString()}`,
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      translationKey: 'error',
      message: 'Something went wrong. Please contact the site administrator.',
      error: error.message,
    } as wpMailResponse,
    { status: 500 });
  }
};

export const testWpMail = async ({ api_url, req, wordpress_password, wordpress_username }: propsPostWpMail & { req: Request }) => {
  const { searchParams } = new URL(req.url);
  const { databaseId, email_receiver, secretKey, content } = Object.fromEntries(searchParams);

  const body: EmailBody = {
    mail: {
      name: 'Test',
      email: email_receiver,
      message: 'Test',
      firstName: 'Test',
      lastName: 'Test',
    },
    transporter: {
      databaseId,
    },
    sender: email_receiver,
    senderEnvelope: "{{firstName}} {{lastName}} <{{email}}>",
    confirmation: {
      subject: 'Test',
      previewText: 'Test',
      html: content || 'Test',
      plainText: content || 'Test',
    },
    dataReceiver: {
      usernames: [email_receiver],
      subject: 'Test',
      previewText: 'Test',
      content: content || 'Test',
    },
    secretKey,
  };

  return postWpMail({
    api_url, wordpress_password, wordpress_username,
    req: { json: () => Promise.resolve(body) } as any,
  });
};