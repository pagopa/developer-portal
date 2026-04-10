'use client';

import { useEffect, useRef } from 'react';
import {
  registerIVSQualityPlugin,
  registerIVSTech,
  VideoJSIVSTech,
  VideoJSQualityPlugin,
} from 'amazon-ivs-player';
import 'video.js/dist/video-js.css';
import videojs from 'video.js';
import { Box } from '@mui/material';
import { amazonIvsVersion } from '@/config';
import '@/styles/videojs-custom.css';
import { useTranslations } from 'next-intl';
import { Chapter } from '@/lib/webinars/types';

interface PlayerProps {
  autoplay: boolean;
  controls: boolean;
  playsInline: boolean;
  src: string;
  poster?: string;
  reloadToken?: number;
  videoOnDemandStartAt?: number;
  startAtChapterSlug?: string;
  chapters?: readonly Chapter[];
  webvttContent?: string;
  // eslint-disable-next-line functional/no-return-void
  setIsVideoPlaying?: (isPlaying: boolean) => void;
}

const HOURS_PART_INDEX = 0;
const MINUTES_PART_INDEX = 1;
const SECONDS_PART_INDEX = 2;

/** Convert a WebVTT timestamp (HH:MM:SS.mmm or MM:SS.mmm) to seconds */
const parseVttTime = (time: string): number | undefined => {
  const parts = time.split(':');
  // eslint-disable-next-line functional/no-let
  let result: number;
  if (parts.length === 3) {
    result =
      parseInt(parts[HOURS_PART_INDEX], 10) * 3600 +
      parseInt(parts[MINUTES_PART_INDEX], 10) * 60 +
      parseFloat(parts[SECONDS_PART_INDEX]);
  } else if (parts.length === 2) {
    result =
      parseInt(parts[HOURS_PART_INDEX], 10) * 60 +
      parseFloat(parts[MINUTES_PART_INDEX]);
  } else {
    result = parseFloat(parts[HOURS_PART_INDEX]);
  }
  return Number.isFinite(result) ? result : undefined;
};

const TECH_ORDER_AMAZON_IVS = ['AmazonIVS'];
const PLAYBACK_RATES = [0.5, 1, 1.25, 1.5, 2];

const VideoJsPlayer = (props: PlayerProps) => {
  const t = useTranslations('webinar');
  const resolvedStartAt = (() => {
    if (
      props.startAtChapterSlug &&
      props.chapters &&
      props.chapters.length > 0
    ) {
      const chapter = props.chapters.find(
        (ch) => ch.slug === props.startAtChapterSlug
      );
      if (chapter) {
        return parseVttTime(chapter.startTime);
      }
    }
    return props.videoOnDemandStartAt;
  })();

  const videoEl = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<
    // @ts-expect-error TS2322: Type 'undefined' is not assignable to type 'Player & VideoJSIVSTech & VideoJSQualityPlugin'.
    videojs.Player & VideoJSIVSTech & VideoJSQualityPlugin
  >(undefined);
  const vttBlobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    registerIVSTech(videojs, {
      wasmBinary: `https://player.live-video.net/${amazonIvsVersion}/amazon-ivs-wasmworker.min.wasm`,
      wasmWorker: `https://player.live-video.net/${amazonIvsVersion}/amazon-ivs-wasmworker.min.js`,
    });
    registerIVSQualityPlugin(videojs);

    if (!videoEl.current) {
      return;
    }

    const player = videojs(videoEl.current, {
      techOrder: TECH_ORDER_AMAZON_IVS,
      autoplay: props.autoplay,
      controls: props.controls,
      playsinline: props.playsInline,
      playbackRates: PLAYBACK_RATES,
      inactivityTimeout: 0,
      // @ts-expect-error TS2322: Type 'undefined' is not assignable to type 'Player & VideoJSIVSTech & VideoJSQualityPlugin'.
    }) as videojs.Player & VideoJSIVSTech & VideoJSQualityPlugin;

    player.enableIVSQualityPlugin();
    //  eslint-disable-next-line functional/immutable-data
    playerRef.current = player;

    if (props.webvttContent) {
      // Create VTT blob and add chapters track
      const blob = new Blob([props.webvttContent], { type: 'text/vtt' });
      const blobUrl = URL.createObjectURL(blob);
      // eslint-disable-next-line functional/immutable-data
      vttBlobUrlRef.current = blobUrl;

      player.addRemoteTextTrack(
        {
          kind: 'chapters',
          src: blobUrl,
          label: t('chapters'),
          default: true,
        },
        false
      );
    }

    return () => {
      playerRef.current?.dispose();
      // eslint-disable-next-line functional/immutable-data
      playerRef.current = undefined;

      // Clean up blob URL
      if (vttBlobUrlRef.current) {
        URL.revokeObjectURL(vttBlobUrlRef.current);
        // eslint-disable-next-line functional/immutable-data
        vttBlobUrlRef.current = null;
      }
    };

    // NOTE: Autoplay is correctly set on initialization only, it should not be a dependency here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.controls, props.playsInline, props.webvttContent]);

  useEffect(() => {
    if (!playerRef.current) {
      return;
    }

    playerRef.current.autoplay(props.autoplay);
    playerRef.current.controls(props.controls);
    playerRef.current.playsinline(props.playsInline);
    playerRef.current.src(props.src);
    playerRef.current.poster(props.poster || '');

    if (props.autoplay && !resolvedStartAt) {
      playerRef.current.play().catch(() => undefined);
    }
  }, [
    props.autoplay,
    props.controls,
    props.playsInline,
    props.poster,
    props.reloadToken,
    props.src,
    resolvedStartAt,
  ]);

  useEffect(() => {
    if (!playerRef.current) {
      return;
    }
    const videoOnDemandStartAt = Number.isFinite(resolvedStartAt)
      ? (resolvedStartAt as number)
      : 0;

    if (videoOnDemandStartAt <= 0) {
      return;
    }
    const player = playerRef.current;
    const seekTo = Math.max(videoOnDemandStartAt, 0);

    // Flag to ensure we only enforce the seek once per prop change
    // eslint-disable-next-line functional/no-let
    let hasSought = false;

    const attemptSeek = (eventName: string) => {
      if (hasSought) return;

      const duration = player.duration();

      if (duration > 0) {
        // eslint-disable-next-line functional/no-try-statements
        try {
          player.currentTime(seekTo);
          // We don't set hasSought = true here for 'loadedmetadata' etc.
          // because we want to double-check on 'play' just in case.
        } catch (e: unknown) {
          console.error(`VideoJsPlayer: [${eventName}] seek failed`, e);
        }
      }
    };

    const onPlay = () => {
      if (hasSought) return;

      const currentTime = player.currentTime();
      const timeDiff = Math.abs(currentTime - seekTo);

      // If we are significantly off (e.g. > 1s), force the seek
      if (timeDiff > 1) {
        player.currentTime(seekTo);
      }

      // Mark as sought so we don't interfere with future seeks/scrubbing
      hasSought = true;
    };

    // Attempt early seek if possible
    if (player.readyState() > 0 && player.duration() > 0) {
      attemptSeek('immediate');
    }

    const onLoadedMetadata = () => attemptSeek('loadedmetadata');
    const onLoadedData = () => attemptSeek('loadeddata');
    const onCanPlay = () => attemptSeek('canplay');
    const onDurationChange = () => attemptSeek('durationchange');

    player.on('loadedmetadata', onLoadedMetadata);
    player.on('loadeddata', onLoadedData);
    player.on('canplay', onCanPlay);
    player.on('durationchange', onDurationChange);
    player.on('play', onPlay);

    return () => {
      player.off('loadedmetadata', onLoadedMetadata);
      player.off('loadeddata', onLoadedData);
      player.off('canplay', onCanPlay);
      player.off('durationchange', onDurationChange);
      player.off('play', onPlay);
    };
  }, [props.reloadToken, props.src, resolvedStartAt]);

  const setIsVideoPlaying = props.setIsVideoPlaying;
  useEffect(() => {
    const player = playerRef.current;
    if (!player || !setIsVideoPlaying) {
      return;
    }

    const onPlay = () => setIsVideoPlaying?.(true);
    const onPause = () => setIsVideoPlaying?.(false);
    const onEnded = () => setIsVideoPlaying?.(false);

    player.on('play', onPlay);
    player.on('pause', onPause);
    player.on('ended', onEnded);

    return () => {
      player.off('play', onPlay);
      player.off('pause', onPause);
      player.off('ended', onEnded);
    };
  }, [setIsVideoPlaying]);

  return (
    <Box sx={{ position: 'relative', paddingBottom: '56.25%' }}>
      <video
        className={'video-js vjs-theme-custom'}
        id='videojs-player'
        ref={videoEl}
        playsInline={props.playsInline}
        autoPlay={props.autoplay}
        controls={props.controls}
        poster={props.poster}
        style={{
          border: 'none',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </Box>
  );
};

export default VideoJsPlayer;
