/* eslint-disable no-unused-vars */
import { useEffect } from 'react';

/**
 * getToken is a function that returns a promise that resolves with a token from Google Recaptcha V3.
 * @returns
 * A promise that resolves with a token.
 * @example
 * const token = await getToken();
 */
export const getToken = () => {
  const { grecaptcha }: any = window;

  const awaitToken = new Promise((resolve) => {
    grecaptcha.ready(() => {
      grecaptcha
        .execute(window.recaptcha_site_key, { action: 'homepage' })
        .then((token: string) => resolve(token));
    });
  });

  return awaitToken;
};

declare global {
  interface Window {
    recaptcha_site_key: string;
  }
}

/**
 * RecaptchaV3 is a React component that renders a script tag for Google Recaptcha V3.
 * @param
 *  - `recaptcha`: The Recaptcha site key.
 * @returns
 * A React element representing the script tag.
 * @example
 * <RecaptchaV3 recaptcha={process.env.RECAPTCHA_KEY} />
 */
export const RecaptchaV3 = ({ recaptcha }: { recaptcha: string }) => {
  useEffect(() => {
    const script = document.createElement('script');

    window.recaptcha_site_key = recaptcha;

    script.src = `https://www.google.com/recaptcha/api.js?render=${recaptcha}`;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
}