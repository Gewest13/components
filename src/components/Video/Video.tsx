import React, { HTMLAttributes, forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import styles from './Video.module.scss'
import { cssMarginVars } from '../../functions/margin';
import { cssRatioVar } from '../../functions/ratios';
import { IFileComponent, Margins, TFile } from '../../interface';

export interface IVideoProps extends HTMLAttributes<HTMLVideoElement> {
  ratio: [number, number];
  src: TFile;
  className?: string;
  margins?: Margins;
  controls?: boolean;
  preload?: "none" | "metadata" | "auto";
}

export const Video = forwardRef<HTMLVideoElement, IVideoProps>((props, ref) => {
  const { ratio, src, className, margins, ...rest } = props;

  return (
    <div data-margin={!!margins} style={{...cssRatioVar(ratio), ...cssMarginVars(margins)}} className={`${className || ' '} ${styles.videoWrap}`}>
      <video 
        autoPlay
        loop
        muted
        playsInline
        className={styles.video}
        src={src.mediaItemUrl} 
        ref={ref} 
        {...rest}
      />
    </div>
  );
});

Video.displayName = 'Video';

export interface VideoComponentProps extends IFileComponent, HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  videoAttributes?: React.HTMLAttributes<HTMLVideoElement>;
}

export const VideoComponent = forwardRef<HTMLDivElement, VideoComponentProps>((props, ref) => {
  const { ratios, src, margins, videoAttributes, children, ...rest } = props;

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
    <div data-margin={!!margins} style={cssMarginVars(margins)} ref={ref} { ...rest}>
      {children && children}
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
  );
});

VideoComponent.displayName = 'VideoComponent';
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


export interface IFullVideo extends IFileComponent, React.HTMLAttributes<HTMLDivElement> {
  /** Source for the full video */
  srcFull: TFile;

  /** Indicates whether the full-screen handling is disabled */
  disableFullScreenHandling?: boolean;

  /** Child elements to be rendered within the full video component */
  children?: React.ReactNode;

  /** Additional HTML attributes for the full video element */
  fullVideoAttributes: HTMLAttributes<HTMLVideoElement>
}

export type ImperativeFullVideoRef = {
  playFullScreen: () => void;
  pauseFullScreen: () => void;
  containerRef: HTMLDivElement;
  fullVideoRef: HTMLVideoElement;
}

export const FullVideo = forwardRef<ImperativeFullVideoRef, IFullVideo>((props, ref) => {
  const { disableFullScreenHandling, fullVideoAttributes, srcFull, className, children, ...rest } = props;

  const fullVideoRef = useRef() as React.MutableRefObject<HTMLVideoElement>;
  const containerRef = useRef() as React.MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    if (disableFullScreenHandling) return;

    const prefixes = ['', 'moz', 'webkit', 'ms'];

    prefixes.forEach((prefix) =>
      document.addEventListener(`${prefix}fullscreenchange`, () => exitFullScreen(fullVideoRef.current))
    );
  }, []);

  useImperativeHandle(ref, () => {
    return {
      playFullScreen: () => {
        if (disableFullScreenHandling) return;

        enterFullScreen(fullVideoRef.current);
      },
      pauseFullScreen: () => {
        if (disableFullScreenHandling) return;

        exitFullScreen(fullVideoRef.current);
      },
      containerRef: containerRef.current,
      fullVideoRef: fullVideoRef.current,
    };
  }, [disableFullScreenHandling]);

  const Tag = disableFullScreenHandling ? 'div' : 'button' as any;

  return (
    <Tag ref={containerRef} className={`${className || ''}`} onClick={!disableFullScreenHandling ? () => enterFullScreen(fullVideoRef.current) : () => null}>
      <VideoComponent {...rest} >
        <Video className={styles.fullVideo} controls={true} preload="none" ref={fullVideoRef} ratio={[0, 0]} src={srcFull} {...fullVideoAttributes} />
      </VideoComponent>
      {children}
    </Tag>
  );
});

FullVideo.displayName = 'FullVideo';