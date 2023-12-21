# Gewest13 components
Gewest13 Library Shared Components is a curated repository of reusable UI assets used by Gewest13. Designed to enhance development efficiency and promote consistency, these components serve as valuable resources for streamlining application creation.

## Table of Contents

1. **Components**
   - [ColumnsContainer](#columnscontainer)
   - [Image](#image)
   - [RecaptchaV3](#recaptchav3)
   - [SharedForm](#sharedform)
   - [Swiper](#swiper)
   - [Video](#video)
   - [SharedTypography](#sharedtypography)

2. **Hooks**
   - [useWindowSize](#usewindowsize)

3. **Functions**
   - [createContainer](#createcontainer)
   - [draftModeWordpress](#draftmodewordpress)
   - [fetchWordpress](#fetchwordpress)
   - [grid](#grid)
   - [margin](#margin)
   - [ratios](#ratios)
   - [vwsize](#vwsize)
   - [wpMail](#wpmail)

4. **Utils**
   - [lerp](#lerp)

5. **All CSS imports**
   - [CSS](#css)

# Components
Components can be imported individually, or you have the option to import all components at once using the root file index.js. Additionally, you can include the main CSS file named index.css, which is situated within @gewest13/components/dist/index.css. However, for optimal organization, it is recommended to import each CSS file separately for the specific components you are utilizing.

### ColumnsContainer
Recommended import:
```javascript
import { ColumnsContainer } from '@gewest13/components/dist/ColumnsContainer';
```
Css import:
```javascript
import '@gewest13/components/dist/ColumnsContainer.css';
```
Example:
```jsx
<ColumnsContainer
  // Optionally, specify a custom grid container
  Container={Container}
  // Define the columns in your grid layout
  columns={[
    {
      // Define the grid columns for different screen sizes
      grids: { 
        desktop: { column: '3 / 5' }, 
        tablet: { column: '3 / 5' }, 
        mobile: { column: '4 / -4' }
      },
      // Specify the component to render inside the column
      component: (
        <Typography mobileMargin={[0, 0, 40, 0]} size="typo-24" tag="h3">
          {heading}
        </Typography>
      ),
    }
  ]}
/>
```

### Image
Recommended import:
```javascript
import { Image } from '@gewest13/components/dist/Image';
```
Css import:
```javascript
import '@gewest13/components/dist/Image.css';
```
Recommended use:
```jsx
// src/shared/Image/Image.tsx
import React from 'react';

import { Image as SharedImage } from '@gewest13/components/dist/Image';

import { vwsizes } from 'config';

export default function Image(props: React.ComponentProps<typeof SharedImage>) {
  return (
    <SharedImage
      vwSizes={vwsizes}
      {...props}
    />
  );
}
```
Example:
```jsx
<Image
  src={{
    desktop: { mediaItemUrl: 'placeholder.jpg', altText: 'placeholder' },
    tablet: { mediaItemUrl: 'placeholder.jpg', altText: 'placeholder' },
    mobile: { mediaItemUrl: 'placeholder.jpg', altText: 'placeholder' },
  }}
  ratios={{ desktop: [1680, 1800], tablet: [840, 900], mobile: [432, 720] }}
/>
```

### RecaptchaV3
Recommended import:
```javascript
import { RecaptchaV3, getToken } from '@gewest13/components/dist/RecaptchaV3';
```
Example:
```jsx
// Recaptcha is the recaptcha site key from the google recaptcha admin
<RecaptchaV3 recaptcha={recaptcha} />
```

### SharedForm
Recommended import:
```javascript
import { SharedForm } from '@gewest13/components/dist/SharedForm';
```
Important:
> ⚠️ To use this shared form you should first import the [wpMail](#wpmail) function.

Example:
```jsx
<SharedForm
  // Best practice to spread props from wordpress
  Container={<form className="example" />}
  confirmationSubject="Confirmation Subject"
  confirmationPreviewText="Confirmation Preview Text"
  // Or render a template on the server on build
  confirmationEmail="<p>Hey {{firstName}}</p>"
  dataReceiverSubject="Data Receiver Subject"
  dataReceiverPreviewText="Data Receiver Preview Text"
  dataReceiverEmail="<p>First name: {{firstName}}</p>"
  mailReceiver={[{databaseId: 3, databaseId: 2, databaseId: 1}]}
  mailSender={{ databaseId: 4 }}
  recaptcha_site_key={recaptcha}
  onSubmit={handleFormSubmit}
  onSuccessfulSubmit={handleSuccessfulSubmit}
  onFailedSubmit={handleFailedSubmit}
  debug={true}
>
  <label htmlFor="textInput">
    Enter Text:
    <input
      type="text"
      id="textInput"
      value=""
    />
  </label>
  {/* Add other form elements as needed */}
</SharedForm>
```

### Swiper
Recommended import:
```javascript
import { Swiper, SwiperCard } from '@gewest13/components/dist/Swiper';
```
Css import:
```javascript
import '@gewest13/components/dist/Swiper.css';
```
Example:
```jsx
<SharedSwiper>
  {slides && slides.map((slide, index) => (
    // Add width and height here
    <SwiperCard className={styles.slideCard} key={index}>
      {slide}
    </SwiperCard>
  ))}
</SharedSwiper>
```

### Video
Recommended import:
```javascript
import { Video, VideoComponent, FullVideo } from '@gewest13/components/dist/Video';
```
Css import:
```javascript
import '@gewest13/components/dist/Video.css';
```
Example:
```jsx
<Video
  src={{mediaItemUrl: 'placeholder.jpg', altText: 'placeholder'}}
  ratio={[1600, 900]}
/>  

<VideoComponent
  src={{
    desktop: { mediaItemUrl: 'placeholder.jpg', altText: 'placeholder' },
    tablet: { mediaItemUrl: 'placeholder.jpg', altText: 'placeholder' },
    mobile: { mediaItemUrl: 'placeholder.jpg', altText: 'placeholder' },
  }}
  ratios={{ desktop: [1680, 1800], tablet: [840, 900], mobile: [432, 720] }}
/>

<FullVideo 
  ref={videoRef} 
  disableFullScreenHandling 
  srcFull={fullVideo} 
  className={styles.video} 
  ratios={{ desktop: [1680, 945] }} 
  src={{ desktop: videoLoop }}
>
  {fullVideo && (
    <button onClick={() => videoRef.current.playFullScreen()}>Play movie</button>
  )}
</FullVideo>
```

### SharedTypography
Example:
```jsx
'use client';

import React, { forwardRef, ForwardedRef } from 'react';

import { SharedTypography, TypographyImperativeHandle } from '@gewest13/components/dist/SharedTypography';

import { vwsizes } from 'config';

import styles from './Typography.module.scss';

export interface TTypography {
  size: TfontSizes;
  className?: string;
}

const Typography = forwardRef((props: React.ComponentProps<typeof SharedTypography> & TTypography, ref: ForwardedRef<TypographyImperativeHandle>) => {
  const { className, size, ...rest } = props;

  return (
    <SharedTypography
      {...rest}
      ref={ref}
      className={`${styles[`typography--${size}`]} ${className || ''}`}
      vwSizes={vwsizes}
    />
  );
});

export default Typography;
```

## Hooks

### useWindowSize
Description for the useWindowSize hook.

## Functions

### createContainer
Description for the createContainer function.

### draftModeWordpress
Recommended import:
```javascript
import { draftModeWordpress } from '@gewest13/components/dist/draftModeWordpress';
```
Example:
```jsx
// Path: app/api/preview/route.ts
import { WORDPRESS_API_URL } from 'config';
import { draftModeWordpress } from '@gewest13/components/dist/draftModeWordpress';

export async function GET(req: any) {
  // When going to /api/preview?uri=1234
  // uri should be the databaseId of the post
  return draftModeWordpress({
    req,
    api_url: WORDPRESS_API_URL,
  });
}
```
```jsx
// Path: inside the root on app level ~/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/api/preview'],
};

export async function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization');
  const url = req.nextUrl;

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [user, pwd] = atob(authValue).split(':');

    return NextResponse.rewrite(`${url}&username=${user}&password=${encodeURIComponent(pwd)}`);
  }

  return NextResponse.rewrite(url, { status: 401 });
}
```
```jsx
// Path src/components/LivePreview/LivePreview.tsx
// This also should be a shared component
'use client';

import React, { Suspense, startTransition, useEffect, useState } from 'react';

import getPage from '@/lib/get-page';

import Components from '@/shared/Components/Components';
import Hero from '@/shared/Hero/Hero';

function getCookie(name: string) {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export default function LivePreview(data: any) {
  const [draftData, setDraftData] = useState(null) as any;
  const { draftMode, id } = data;
  const { acfComponents, acfHero } = draftData || data;

  useEffect(() => {
    if (!draftMode) return undefined;

    const authToken = getCookie('token');

    if (!authToken) return undefined;

    const intervalId = setInterval(async () => {
      const pageData = await getPage({ id });

      startTransition(() => {
        setDraftData(pageData);
      });
    }, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <Suspense fallback={null}>
      <Hero acfHero={acfHero} />
      <Components acfComponents={acfComponents} />
    </Suspense>
  );
}
```

### fetchWordpress
Description for the fetchWordpress function.

### grid
Description for the grid function.

### margin
Description for the margin function.

### ratios
Description for the ratios function.

### vwsize
Description for the vwsize function.

### wpMail
Recommended import:
```javascript
import { wpMail } from '@gewest13/components/dist/wpMail';
```
Example:
```jsx
// Path: app/api/mail/route.ts
import { WORDPRESS_API_URL } from 'config';
import { testWpMail, postWpMail } from '@gewest13/components/dist/wpMail';

export async function GET(req: any) {
  return testWpMail({
    req,
    api_url: WORDPRESS_API_URL,
    // NEVER EXPOSE THIS IN
    wordpress_username: process.env.WORDPRESS_USERNAME!,
    wordpress_password: process.env.WORDPRESS_PASSWORD!,
  });
}

export async function POST(req: any) {
  return postWpMail({
    req,
    api_url: WORDPRESS_API_URL,
    wordpress_username: process.env.WORDPRESS_USERNAME!,
    wordpress_password: process.env.WORDPRESS_PASSWORD!,
  });
}
```

## Utils

### lerp
Description 

## CSS
Comment out not needed css imports inside layout or app

```jsx
import '@gewest13/components/dist/ColumnsContainer/ColumnsContainer.css';
import '@gewest13/components/dist/Image/Image.css';
import '@gewest13/components/dist/SharedFormConfirmation/SharedFormConfirmation.css';
import '@gewest13/components/dist/Swiper/Swiper.css';
import '@gewest13/components/dist/Video/Video.css';
```