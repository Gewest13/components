// // import fsPromises from 'fs/promises';
// // import path from 'path';

// // import { WORDPRESS_API_URL } from 'config';
// import { NextResponse } from 'next/server';
// import nodemailer from 'nodemailer';

// // import { fetchWP } from '@/lib/fetch-wordpress';

// import { getAllPrivateSettings, loginMutation } from '@/query/pages.data';


// export type Data = {
//   error?: string;
//   message?: string;
// };

// async function sendNodeMailer(
//   transporter: nodemailer.Transporter,
//   mailData: nodemailer.SendMailOptions,
// ): Promise<nodemailer.SentMessageInfo> {
//   try {
//     const info = await transporter.sendMail(mailData);
//     console.log(info);
//     return info;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }

// // const filePath = path.join('/tmp', 'secure.json');

// export const wpMail = async (api_url: string, req: Request) => {
//   const body = await req.json();

//   const {
//     mail_reciever_id,
//     mail,
//     subject,
//     confirmationMail,
//     mail_sender_id,
//     mail_subject,
//     recaptcha,
//   } = body;

//   const result = await fetch(WORDPRESS_API_URL, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       query: loginMutation,
//       variables: {
//         input: {
//           username: process.env.WORDPRESS_USERNAME,
//           password: process.env.WORDPRESS_PASSWORD,
//         },
//       },
//     }),
//   });

//   const jsonResponse = await result.json();

//   const { allPrivateSettings } = await fetchWP(
//     getAllPrivateSettings,
//     undefined,
//     jsonResponse.data.login.authToken,
//   );

//   const formattedData = allPrivateSettings.nodes[0].acfPrivate;

//   // const getPrivateSettings = await fsPromises.readFile(filePath, 'utf-8');
//   const privateSettings: TPrivateSettings = formattedData;

//   const getSmtpAccountMailReciever = privateSettings.smtp.smtpAccounts.find(
//     ({ smtpAccount }) => smtpAccount.id === mail_reciever_id,
//   );

//   const getSmtpAccountMailSender = privateSettings.smtp.smtpAccounts.find(
//     ({ smtpAccount }) => smtpAccount.id === mail_sender_id,
//   );

//   const RECAPTCHA_SECRET_KEY = privateSettings.recaptcha.secretKey;

//   if (!getSmtpAccountMailReciever) {
//     return NextResponse.json(
//       { error: 'SMTP account mail reciever not found.', message: 'SMTP account mail reciever not found.' },
//       { status: 500 },
//     );
//   }

//   if (!RECAPTCHA_SECRET_KEY) {
//     return NextResponse.json(
//       { error: 'Recaptcha secret key not found.', message: 'Recaptcha secret key not found. Please contact the site administrator.' },
//       { status: 500 },
//     );
//   }

//   const {
//     smtpAccount: {
//       acfSmtp: { username: RECIEVER_MAIL_USERNAME },
//     },
//   } = getSmtpAccountMailReciever!;

//   const {
//     password: SENDER_MAIL_PASSWORD,
//     smtpAccount: {
//       acfSmtp: {
//         port: SENDER_MAIL_PORT,
//         server: SENDER_MAIL_SERVER,
//         username: SENDER_MAIL_USERNAME,
//       },
//     },
//   } = getSmtpAccountMailSender!;

//   if (!RECIEVER_MAIL_USERNAME || !RECAPTCHA_SECRET_KEY || !recaptcha) {
//     return NextResponse.json(
//       { error: 'One or more required environment variables are missing. Please check your .env file.', message: 'Something went wrong. Please contact the site administrator.' },
//       { status: 500 },
//     );
//   }

//   const sender = nodemailer.createTransport({
//     port: SENDER_MAIL_PORT as unknown as number,
//     host: SENDER_MAIL_SERVER,
//     auth: {
//       user: SENDER_MAIL_USERNAME,
//       pass: SENDER_MAIL_PASSWORD,
//     },
//   });

//   try {
//     await sender.verify();
//     console.log('Server is ready to take our messages');
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json(
//       { error: 'Failed to verify the mail server connection.', message: 'Something went wrong. Please contact the site administrator.' },
//       { status: 500 },
//     );
//   }

//   // @ts-ignore
//   // const message = Object.keys(mail).map(([key, value]) => `<strong>${key}</strong>: ${value}</br>`);
//   const message = Object.keys(mail).map(
//     (key) => `<strong>${key}</strong>: ${mail[key]}</br>`,
//   );

//   const mailData = {
//     from: SENDER_MAIL_USERNAME,
//     to: RECIEVER_MAIL_USERNAME,
//     subject: mail_subject,
//     text: message.join(''),
//     html: message.join(''),
//   };

//   const clientData = {
//     from: SENDER_MAIL_USERNAME,
//     to: mail.email,
//     subject,
//     html: confirmationMail,
//   };

//   try {
//     const recaptchaRes = await fetch(
//       `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${recaptcha}`,
//       {
//         method: 'POST',
//       },
//     );
//     const json = await recaptchaRes.json();

//     if (json.success !== undefined && !json.success) {
//       // return res.status(401).json({
//       //   error: 'Bot detected',
//       //   message: 'Something went wrong. Please contact the site administrator.',
//       // });
//       return NextResponse.json(
//         { error: 'Bot detected', message: 'Something went wrong. Please contact the site administrator.' },
//         { status: 500 },
//       );
//     }

//     await sendNodeMailer(sender, mailData);
//     await sendNodeMailer(sender, clientData);

//     return NextResponse.json(
//       { message: 'The mail was successfully sent.' },
//       { status: 200 },
//     );
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message, message: 'Something went wrong. Please contact the site administrator.' },
//       { status: 500 },
//     );
//   }
// }
