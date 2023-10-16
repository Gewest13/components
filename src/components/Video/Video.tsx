/* eslint-disable react/display-name */
import React, { forwardRef,  useEffect, useRef } from 'react'
import style from './Video.module.scss'
import {  cssMarginVars } from '../../functions/Margins';
import { IFileComponent, Margins } from '../../interface';

export interface TFile {
  mediaItemUrl: string
  altText?: string
}

export interface IVideo {
  ratio: [number, number];
  src: TFile;
  className?: string;
  margins?: Margins;
}

export const Video = forwardRef<HTMLVideoElement, IVideo & React.HTMLAttributes<HTMLVideoElement>>((props, ref) => {
  const { ratio, src, className, margins, ...rest } = props

  const cssRatioVar = { "--aspect-ratio": `${ratio ? ratio[0] / ratio[1] : 1}` } as React.CSSProperties;

  return (
    <div data-margin style={{...cssRatioVar, ...cssMarginVars(margins)}} className={`${className || ' '} ${style.videoWrap}`}>
      <video 
        autoPlay
        loop
        muted
        playsInline
        className={style.video} 
        src={src.mediaItemUrl} 
        ref={ref} 
        {...rest} 
      />
    </div>
  )
})



export const VideoComponent = forwardRef<HTMLDivElement, { videoAttributes?: React.HTMLAttributes<HTMLVideoElement> } & IFileComponent & React.HTMLAttributes<HTMLDivElement>>((props, ref) => {
  const { ratios, src, margins, videoAttributes, ...rest } = props

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
    <div data-margin style={cssMarginVars(margins)} ref={ref} { ...rest}>
      {src.mobile && ratios.mobile && (
        <Video data-viewport={`mobile ${addedClassNames}`} src={src.mobile} ratio={ratios.mobile} {...videoAttributes}  />
      )}
      {src.tablet && ratios.tablet && (
        <Video data-viewport={`tablet ${addedClassNames}`} src={src.tablet} ratio={ratios.tablet} {...videoAttributes}  />
      )}
      {src.desktop && ratios.desktop && (
        <Video data-viewport={`desktop ${addedClassNames}`} src={src.desktop} ratio={ratios.desktop} {...videoAttributes}  />
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


interface IFullVideo extends IFileComponent {
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

    prefixes.forEach((prefix) => document.addEventListener(`${prefix}fullscreenchange`, () => exitFullScreen(fullVideoRef.current)));
  }, [])

  return (
    <Tag onClick={!disableFullScreenHandling ? () => enterFullScreen(fullVideoRef.current) : () => null} ref={ref as any}>
      <Video {...fullVideoAttributes} ref={fullVideoRef} ratio={[0, 0]} src={videoSource} />
      <VideoComponent {...rest} />
      {children}
    </Tag>
  )
})