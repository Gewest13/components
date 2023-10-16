/* eslint-disable react/display-name */
import React, { forwardRef,  useEffect, useRef } from 'react'
import style from './Video.module.scss'

export interface TFile {
  mediaItemUrl: string
  altText?: string
}

export interface IVideo {
  ratio: [number, number];
  src: TFile;
  className?: string;
}

export const Video = forwardRef<HTMLVideoElement, IVideo & React.HTMLAttributes<HTMLVideoElement>>((props, ref) => {
  const { ratio, src, className, ...rest } = props

  const cssRatioVar = { "--aspect-ratio": `${ratio ? ratio[0] / ratio[1] : 1}` } as React.CSSProperties;

  return (
    <div style={cssRatioVar} className={style.videoWrap}>
      <video 
        autoPlay
        loop
        muted
        playsInline
        className={`${className || ''} ${style.video}`} 
        
        src={src.mediaItemUrl} 
        ref={ref} 
        {...rest} 
        />
      </div>
  )
})

export interface VideoSource {
  /** URL of the video source for desktop devices */
  desktop: TFile;
  /** URL of the video source for tablet devices */
  tablet?: TFile;
  /** URL of the video source for mobile devices */
  mobile?: TFile;
}

export interface VideoRatios {
  /** Aspect ratio for desktop view (width, height) */
  desktop: [number, number];
  /** Aspect ratio for tablet view (width, height) */
  tablet?: [number, number];
  /** Aspect ratio for mobile view (width, height) */
  mobile?: [number, number];
}

export interface IVideoComponent {
  /** Video src for different device types */
  src: VideoSource;
  /** Aspect ratios for different device types */
  ratios: VideoRatios;
}

export const VideoComponent = forwardRef<HTMLDivElement, IVideoComponent & React.HTMLAttributes<HTMLDivElement>>((props, ref) => {
  const { ratios, src, ...rest } = props

  let addedClassNames = '';

  if (!src.mobile) {
    addedClassNames += ' mobile';
  }

  if (!src.tablet) {
    addedClassNames += ' tablet';
  }

  if (!src.desktop) {
    addedClassNames += ' desktop';
  }

  return (
    <div ref={ref} { ...rest}>
      {src.mobile && ratios.mobile && (
        <Video className={addedClassNames + " mobile"} src={src.mobile} ratio={ratios.mobile}  />
      )}
      {src.tablet && ratios.tablet && (
        <Video className={addedClassNames + " tablet"} src={src.tablet} ratio={ratios.tablet}  />
      )}
      {src.desktop && ratios.desktop && (
        <Video className={addedClassNames + " desktop"} src={src.desktop} ratio={ratios.desktop}  />
      )}
    </div>
  )
})

interface CustomDocument extends Document {
  webkitIsFullScreen?: boolean;
  mozFullScreen?: boolean;
  msFullscreenElement?: Element | null;
  webkitFullscreenElement?: boolean
}

interface CustomVideoElement extends HTMLVideoElement {
  mozRequestFullscreen?: () => Promise<void>;
  webkitRequestFullscreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
  webkitEnterFullScreen?: () => Promise<void>;
}

const requestFullScreen = (video: CustomVideoElement) => {
  const requestFullscreenFunction = video.requestFullscreen
    || video.mozRequestFullscreen
    || video.webkitRequestFullscreen
    || video.webkitEnterFullScreen
    || video.msRequestFullscreen;
  requestFullscreenFunction.call(video);
};

const isFullScreen = () => {
  const doc = document as unknown as CustomDocument;
  return !!(
    doc.fullscreenElement
    || doc.webkitIsFullScreen
    || doc.webkitFullscreenElement
    || doc.mozFullScreen
    || doc.msFullscreenElement
  );
};

export const enterFullScreen = (element: HTMLVideoElement) => {
  if (!element) return;

  requestFullScreen(element);
  element.play();
}

export const exitFullScreen = (element: HTMLVideoElement) => {
  if (!element) return;

  if (!isFullScreen()) {
    element.pause()
  }
}


interface IFullVideo extends IVideoComponent {
  /** Source for the full video */
  videoSource: TFile;

  /** Indicates whether the full-screen handling is disabled */
  disableFullScreenHandling?: boolean;

  /** Child elements to be rendered within the full video component */
  children?: React.ReactNode;

  /** Additional HTML attributes for the full video element */
  fullVideoAttributes: React.HTMLAttributes<HTMLVideoElement>
}


export const FullVideo = forwardRef<HTMLDivElement | HTMLButtonElement, IFullVideo>((props, ref) => {
  const { disableFullScreenHandling, fullVideoAttributes, videoSource, children, ...rest } = props
  
  const fullVideoRef = useRef() as React.MutableRefObject<HTMLVideoElement>;

  const Tag = disableFullScreenHandling ? 'div' : 'button'

  useEffect(() => {
    if (disableFullScreenHandling) return;

    const prefixes = ['', 'moz', 'webkit', 'ms'];

    prefixes.forEach((prefix) => document.addEventListener(`${prefix}fullscreenchange`, () => handleCloseFullScreen(fullVideoRef.current)));
  }, [])

  return (
    <Tag onClick={!disableFullScreenHandling ? () => handleFullScreen(fullVideoRef.current) : () => null} ref={ref as any}>
      <Video {...fullVideoAttributes} ref={fullVideoRef} ratio={[0, 0]} src={videoSource} />
      <VideoComponent {...rest} />
      {children}
    </Tag>
  )
})