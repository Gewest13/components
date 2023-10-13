/* eslint-disable react/display-name */
import React, { forwardRef,  useEffect, useRef } from 'react'
import style from './Video.module.scss'

interface TFile {
  mediaItemUrl: string
  altText?: string
}

interface IVideo {
  ratio: [number, number];
  src: TFile;
  className?: string;
}

export const Video = forwardRef<HTMLVideoElement, IVideo & React.HTMLAttributes<HTMLVideoElement>>((props, ref) => {
  const { ratio, src, className, ...rest } = props

  const cssRatioVar = { "--aspect-ratio": `${ratio ? ratio[0] / ratio[1] : 1}` } as React.CSSProperties;

  return (
    <video 
      autoPlay
      loop
      muted
      playsInline
      className={`${className || ''} ${style.video}`} 
      style={cssRatioVar} 
      src={src.mediaItemUrl} 
      ref={ref} 
      {...rest} 
    />
  )
})

interface IVideoComponent {
  /** Optional mobile src */
  srcMobile?: TFile
  /** Optional tablet src */
  srcTablet?: TFile
  /** Optional desktop src */
  srcDesktop?: TFile
  /** desktopRatio: [width, height]. */
  desktopRatio: [number, number];
  /** tabletRatio: [width, height]. */
  tabletRatio?: [number, number];
  /** mobileRatio: [width, height]. */
  mobileRatio?: [number, number];
}


export const VideoComponent = forwardRef<HTMLDivElement, IVideoComponent & React.HTMLAttributes<HTMLDivElement>>((props, ref) => {
  const { srcMobile, srcTablet, srcDesktop, desktopRatio, tabletRatio, mobileRatio, ...rest } = props

  let addedClassNames = '';

  if (!srcMobile) {
    addedClassNames += ' mobile';
  }

  if (!srcTablet) {
    addedClassNames += ' tablet';
  }

  if (!srcDesktop) {
    addedClassNames += ' desktop';
  }

  return (
    <div ref={ref} { ...rest}>
      {srcMobile && mobileRatio && (
        <Video className={addedClassNames + " mobile"} src={srcMobile} ratio={mobileRatio}  />
      )}
      {srcTablet && tabletRatio && (
        <Video className={addedClassNames + " tablet"} src={srcTablet} ratio={tabletRatio}  />
      )}
      {srcDesktop && desktopRatio && (
        <Video className={addedClassNames + " desktop"} src={srcDesktop} ratio={desktopRatio}  />
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

export const handleFullScreen = (element: HTMLVideoElement) => {
  if (!element) return;

  requestFullScreen(element);
  element.play();
}

export const handleCloseFullScreen = (element: HTMLVideoElement) => {
  if (!element) return;

  if (!isFullScreen()) {
    element.pause()
  }
}

interface IFullVideo extends IVideo {
  propsFullVideo: React.HTMLAttributes<HTMLVideoElement>
  fullVideoSrc: TFile
  disableFullScreenHandler?: boolean
  children?: React.ReactNode
}

export const FullVideo = forwardRef<HTMLDivElement | HTMLButtonElement, IFullVideo>((props, ref) => {
  const { disableFullScreenHandler, propsFullVideo, fullVideoSrc, children, ...rest } = props
  
  const fullVideoRef = useRef() as React.MutableRefObject<HTMLVideoElement>;

  const Tag = disableFullScreenHandler ? 'div' : 'button'

  useEffect(() => {
    if (disableFullScreenHandler) return;

    const prefixes = ['', 'moz', 'webkit', 'ms'];

    prefixes.forEach((prefix) => document.addEventListener(`${prefix}fullscreenchange`, () => handleCloseFullScreen(fullVideoRef.current)));
  }, [])

  return (
    <Tag onClick={!disableFullScreenHandler ? () => handleFullScreen(fullVideoRef.current) : () => null} ref={ref as any}>
      <Video {...propsFullVideo} ref={fullVideoRef} ratio={[0, 0]} src={fullVideoSrc} />
      <Video {...rest} />
      {children}
    </Tag>
  )
})