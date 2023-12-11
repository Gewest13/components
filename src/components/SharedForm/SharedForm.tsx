import React, { forwardRef } from 'react';

import { createContainer } from '../../functions/createContainer';
import { EmailBody } from '../../functions/wpMail';
import { RecaptchaV3, getToken } from '../RecaptchaV3/RecaptchaV3';

export interface ISharedFormProps {
  // ** Preferable a form element */
  Container: React.ReactElement<HTMLDivElement> | React.ForwardRefExoticComponent<any | React.RefAttributes<HTMLDivElement>>

  // ** The children of the form */
  children?: React.ReactNode

  // ** Confirmation subject */
  confirmationSubject?: string
  // ** Confirmation preview text */
  confirmationPreviewText?: string
  // ** This could be anything (object array string). Based off if their is a confirmationEmailTemplate */
  confirmationEmail: any
  // ** This should be a react email template we should pass this since we want to render the confirmation email template on the server to save extra kb's on client side */
  confirmationEmailTemplate?: any
  // ** Subject for the data reciever */
  dataRecieverSubject?: string
  // ** Preview text for the data reciever */
  dataRecieverPreviewText?: string
  // ** This should be a string since their is no temlate option for the data reciever */
  dataRecieverEmail: string
  // ** A list of SMTP account ids to send the data reciever email to */
  mailReciever: {
    databaseId: (number | string)
  }[]
  // ** The database ID of the mail sender */
  mailSender: {
    databaseId: (number | string)
  }
  // ** The recaptcha site key */
  recaptcha_site_key: string

  // ** Form event handlers inside the handle submit */
  onSubmit?: (e: React.FormEvent, formData: { [key: string]: string }) => void
  onSuccessfulSubmit?: (response: any) => void
  onFailedSubmit?: (response: any) => void

  // ** Debug mode */
  debug?: boolean
}

export const SharedForm = forwardRef<HTMLDivElement, ISharedFormProps & React.HTMLAttributes<HTMLDivElement>>((props, ref) => {
  const {
    // Children
    children,
    // Custom Events
    onSubmit, onSuccessfulSubmit, onFailedSubmit,
    // Props
    debug, recaptcha_site_key, mailSender, mailReciever, confirmationSubject, confirmationPreviewText, confirmationEmail, confirmationEmailTemplate, dataRecieverEmail, dataRecieverSubject, dataRecieverPreviewText,
    // HTML Props and Container
    Container = 'div', ...rest
  } = props;

  const CreatedContainer = createContainer(Container);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fields = (e.target as HTMLFormElement).elements;
    const formData: { [key: string]: string } = {};

    Array.from(fields).forEach((field) => {
      const inputField = field as HTMLInputElement;

      if (inputField.name) {
        formData[inputField.name] = inputField.value;
      }
    });

    if (debug) console.log('FormData: ', formData);

    onSubmit && onSubmit(e, formData);

    let emailTemplate: any = null;

    if (confirmationEmailTemplate) {
      const Render = (await import('@react-email/components')).render;

      emailTemplate = Render(confirmationEmailTemplate({ previewText: confirmationPreviewText, data: confirmationEmail }));
    }

    const body: EmailBody = {
      recaptcha: await getToken() as string,
      mail: formData,
      confirmation: {
        subject: confirmationSubject!,
        previewText: confirmationPreviewText!,
        content: emailTemplate || confirmationEmail,
      },
      dataReciever: {
        id: mailReciever.map(({ databaseId }) => databaseId),
        subject: dataRecieverSubject!,
        previewText: dataRecieverPreviewText!,
        content: dataRecieverEmail,
      },
      sender: {
        id: mailSender.databaseId,
      }
    }

    if (debug) console.log('EmailBody: ', body);

    const repsonse = await fetch('api/mail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },

      body: JSON.stringify({ ...body }),
    });

    if (repsonse.status === 200) {
      onSuccessfulSubmit && onSuccessfulSubmit(repsonse);

      Array.from(fields).forEach((field) => {
        const inputField = field as HTMLInputElement;

        if (inputField.name) {
          inputField.value = '';
        }
      });
    } else {
      onFailedSubmit && onFailedSubmit(repsonse);
    }
  }

  return (
    <>
      <RecaptchaV3 recaptcha={recaptcha_site_key} />
      <CreatedContainer onSubmit={handleSubmit} ref={ref} {...rest}>
        {children}
      </CreatedContainer>
    </>
  );
});

SharedForm.displayName = 'SharedForm';