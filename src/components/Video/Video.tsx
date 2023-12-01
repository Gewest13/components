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
  'data-viewport'?: string;
}

/**
 * Video is a React component that renders a video element with additional styling and functionalities.
 *
 * @param props - The properties passed to the component:
 *   - `ratio`: Aspect ratio of the video.
 *   - `src`: Source file of the video.
 *   - `className`: Additional className for custom styling.
 *   - `margins`: Margins to be applied to the video container.
 *   - `controls`: Controls whether the video should have playback controls.
 *   - `preload`: Specifies how the video should be preloaded. Options are "none", "metadata", or "auto".
 *   - `data-viewport`: Custom data attribute for viewport-specific behavior.
 * @param ref - Ref forwarded to the video element.
 * @returns A React element representing the video.
 *
 * @example
 * <Video
 *   ratio={[16, 9]}
 *   src={{ mediaItemUrl: 'video-url.mp4' }}
 *   className="custom-video-class"
 *   margins={{ top: '10px', bottom: '10px' }}
 *   controls
 *   preload="auto"
 *   data-viewport="desktop"
 * />
 */
export const Video = forwardRef<HTMLVideoElement, IVideoProps>((props, ref) => {
  const { ratio, src, className, margins, 'data-viewport': viewport, ...rest } = props;

  return (
    <div data-viewport={viewport} data-margin={!!margins} style={{ ...cssRatioVar(ratio), ...cssMarginVars(margins) }} className={`${className || ' '} ${styles.videoWrap}`}>
      <video
        data-viewport={viewport}
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

/**
 * VideoComponent is a React component that renders a responsive video container, which can adapt to different screen sizes.
 *
 * @param props - The properties passed to the component:
 *   - `ratios`: Aspect ratios for different screen sizes.
 *   - `src`: Source files for different screen sizes.
 *   - `margins`: Margins to be applied to the video container.
 *   - `videoAttributes`: Additional attributes for the video element.
 *   - `children`: Child elements to be rendered within the video component.
 * @param ref - Ref forwarded to the container.
 * @returns A React element representing the video container.
 *
 * @example
 * <VideoComponent
 *   src={{ mobile: mobileSrc, tablet: tabletSrc, desktop: desktopSrc }}
 *   ratios={{ mobile: [4, 3], tablet: [16, 9], desktop: [21, 9] }}
 *   margins={{ top: '15px', bottom: '15px' }}
 * >
 *   <div>Additional Content</div>
 * </VideoComponent>
 */
export const VideoComponent = forwardRef<HTMLDivElement, VideoComponentProps>((props, ref) => {
  const { ratios, src, margins, videoAttributes, children, ...rest } = props;

  const hasOneVideo = Object.keys(src).length === 1;

  return (
    <div data-margin={!!margins} style={cssMarginVars(margins)} ref={ref} { ...rest}>
      {children && children}
      {src.mobile && ratios.mobile && (
        <Video data-viewport={`${!hasOneVideo ? 'mobile' : ''}`} src={src.mobile} ratio={ratios.mobile} {...videoAttributes}  />
      )}
      {src.tablet && ratios.tablet && (
        <Video data-viewport={`${!hasOneVideo ? 'tablet' : ''}`} src={src.tablet} ratio={ratios.tablet} {...videoAttributes}  />
      )}
      {src.desktop && ratios.desktop && (
        <Video data-viewport={`${!hasOneVideo ? 'desktop' : ''}`} src={src.desktop} ratio={ratios.desktop} {...videoAttributes}  />
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
  srcFull?: TFile;

  /** Indicates whether the full-screen handling is disabled */
  disableFullScreenHandling?: boolean;

  /** Child elements to be rendered within the full video component */
  children?: React.ReactNode;

  /** Additional HTML attributes for the full video element */
  fullVideoAttributes?: HTMLAttributes<HTMLVideoElement>
}

export type ImperativeFullVideoRef = {
  playFullScreen: () => void;
  pauseFullScreen: () => void;
  containerRef: HTMLDivElement | HTMLButtonElement | null;
  fullVideoRef: HTMLVideoElement;
}

/**
 * FullVideo is a React component that provides a full-screen video experience with additional control methods.
 *
 * @param props - The properties passed to the component:
 *   - `srcFull`: Source for the full video.
 *   - `disableFullScreenHandling`: Indicates whether the full-screen handling is disabled.
 *   - `children`: Child elements to be rendered within the full video component.
 *   - `fullVideoAttributes`: Additional HTML attributes for the full video element.
 * @param ref - Ref object for accessing imperative methods.
 * @returns A React element representing the full-screen video.
 *
 * @example
 * <FullVideo
 *   srcFull={{ mediaItemUrl: 'full-screen-video-url.mp4' }}
 *   disableFullScreenHandling={false}
 * >
 *   <p>Additional Content</p>
 * </FullVideo>
 */
export const FullVideo = forwardRef<ImperativeFullVideoRef, IFullVideo>((props, ref) => {
  const { disableFullScreenHandling, fullVideoAttributes, srcFull, className, children, ...rest } = props;

  const fullVideoRef = useRef() as React.MutableRefObject<HTMLVideoElement>;
  const divRef = useRef<React.ElementRef<'div'>>(null);
  const buttonRef = useRef<React.ElementRef<'button'>>(null)

  useEffect(() => {
    if (disableFullScreenHandling) return;

    const prefixes = ['', 'moz', 'webkit', 'ms'];

    prefixes.forEach((prefix) =>
      document.addEventListener(`${prefix}fullscreenchange`, () => exitFullScreen(fullVideoRef.current))
    );
  }, []);

  useImperativeHandle(ref, () => ({
    playFullScreen: () => {
      if (!disableFullScreenHandling) return;

      enterFullScreen(fullVideoRef.current);
    },
    pauseFullScreen: () => {
      if (!disableFullScreenHandling) return;

      exitFullScreen(fullVideoRef.current);
    },
    containerRef: divRef.current || buttonRef.current,
    fullVideoRef: fullVideoRef.current,
  }), [disableFullScreenHandling]);

  // Someone fix this ugly code (it's not from Niels Reijnders)
  if (disableFullScreenHandling) {
    return (
      <div ref={divRef} className={className}>
        <VideoComponent {...rest} >
          {srcFull && (
            <Video className={styles.fullVideo} controls={true} preload="none" ref={fullVideoRef} ratio={[0, 0]} src={srcFull} {...fullVideoAttributes} />
          )}
        </VideoComponent>
        {children}
      </div>
    );
  }

  return (
    <button ref={buttonRef} className={className} onClick={() => enterFullScreen(fullVideoRef.current)}>
      <VideoComponent {...rest} >
        {srcFull && (
          <Video className={styles.fullVideo} controls={true} preload="none" ref={fullVideoRef} ratio={[0, 0]} src={srcFull} {...fullVideoAttributes} />
        )}
      </VideoComponent>
      {children}
    </button>
  );
});

FullVideo.displayName = 'FullVideo';