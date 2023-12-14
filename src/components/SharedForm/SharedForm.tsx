import React, { forwardRef } from 'react';

import { createContainer } from '../../functions/createContainer';
import { EmailBody, wpMailResponse } from '../../functions/wpMail';
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
  confirmationEmail: string
  // ** This should be a react email template we should pass this since we want to render the confirmation email template on the server to save extra kb's on client side */
  // confirmationEmailTemplate?: any
  // ** Subject for the data receiver */
  dataReceiverSubject?: string
  // ** Preview text for the data receiver */
  dataReceiverPreviewText?: string
  // ** This should be a string since their is no template option for the data receiver */
  dataReceiverEmail: string
  // ** A list of SMTP account ids to send the data receiver email to */
  mailReceiver: {
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

  setTranslationKey: (key: wpMailResponse['translationKey'] | 'sending') => void

  // ** Debug mode */
  debug?: boolean
}

export const SharedForm = forwardRef<HTMLDivElement, ISharedFormProps & React.HTMLAttributes<HTMLDivElement>>((props, ref) => {
  const {
    // Children
    children,
    // Custom Events
    onSubmit, onSuccessfulSubmit, onFailedSubmit,
    // Get the translation key
    setTranslationKey,
    // Props
    debug, recaptcha_site_key, mailSender, mailReceiver, confirmationSubject, confirmationPreviewText, confirmationEmail, dataReceiverEmail, dataReceiverSubject: dataReceiverSubject, dataReceiverPreviewText,
    // HTML Props and Container
    Container = 'div', ...rest
  } = props;

  const CreatedContainer = createContainer(Container);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTranslationKey && setTranslationKey('sending');

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

    const body: EmailBody = {
      recaptcha: await getToken() as string,
      mail: formData,
      confirmation: {
        subject: confirmationSubject!,
        previewText: confirmationPreviewText!,
        content: confirmationEmail,
        // Deprecated
        // emailTemplate: confirmationEmailTemplate.toString(),
      },
      dataReceiver: {
        id: mailReceiver.map(({ databaseId }) => databaseId),
        subject: dataReceiverSubject!,
        previewText: dataReceiverPreviewText!,
        content: dataReceiverEmail,
      },
      sender: {
        id: mailSender.databaseId,
      }
    }

    if (debug) console.log('EmailBody: ', body);

    const response = await fetch('api/mail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },

      body: JSON.stringify({ ...body }),
    });

    const json = await response.json() as wpMailResponse;

    setTranslationKey && setTranslationKey(json.message as wpMailResponse['translationKey']);

    if (response.status === 200) {
      onSuccessfulSubmit && onSuccessfulSubmit(response);

      Array.from(fields).forEach((field) => {
        const inputField = field as HTMLInputElement;

        if (inputField.name) {
          inputField.value = '';
        }
      });
    } else {
      onFailedSubmit && onFailedSubmit(response);
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