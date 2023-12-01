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

## Components

### ColumnsContainer
Recommended Import
```javascript
import { ColumnsContainer } from '@gewest13/components/dist/ColumnsContainer';
```
Layout.tsx or App.tsx
```javascript
import '@gewest13/components/dist/ColumnsContainer.css';
```
Alternative Import
```javascript
import { ColumnsContainer } from "@gewest13/components";
```
Example
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
Description for the Image component.

### RecaptchaV3
Description for the RecaptchaV3 component.

### SharedForm
Description for the SharedForm component.

### Swiper
Description for the Swiper component.

### Video
Description for the Video component.

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
