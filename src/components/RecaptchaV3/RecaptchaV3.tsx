/* eslint-disable no-unused-vars */
import { useEffect } from 'react';

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
