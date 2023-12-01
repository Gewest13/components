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
  confirmationEmail="<p>Hey {{firstname}}</p>"
  // React email template here
  confirmationEmailTemplate={null}
  dataRecieverSubject="Data Receiver Subject"
  dataRecieverPreviewText="Data Receiver Preview Text"
  dataRecieverEmail="<p>First name: {{firstname}}</p>"
  mailReciever={{ databaseId: [1, 2, 3] }}
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

## Hooks

### useWindowSize
Description for the useWindowSize hook.

## Functions

### createContainer
Description for the createContainer function.

### draftModeWordpress
Description for the draftModeWordpress function.

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
Description for the wpMail function.

## Utils

### lerp
Description 
