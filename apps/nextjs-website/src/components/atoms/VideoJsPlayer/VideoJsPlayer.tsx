/* eslint-disable functional/no-try-statements */
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

interface PlayerProps {
  autoplay: boolean;
  controls: boolean;
  playsInline: boolean;
  src: string;
  poster?: string;
  reloadToken?: number;
  videoOnDemandStartAt?: number;
}

const TECH_ORDER_AMAZON_IVS = ['AmazonIVS'];

const VideoJsPlayer = (props: PlayerProps) => {
  const videoEl = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<
    // @ts-expect-error TS2322: Type 'undefined' is not assignable to type 'Player & VideoJSIVSTech & VideoJSQualityPlugin'.
    videojs.Player & VideoJSIVSTech & VideoJSQualityPlugin
  >(undefined);

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
      // @ts-expect-error TS2322: Type 'undefined' is not assignable to type 'Player & VideoJSIVSTech & VideoJSQualityPlugin'.
    }) as videojs.Player & VideoJSIVSTech & VideoJSQualityPlugin;

    player.enableIVSQualityPlugin();
    //  eslint-disable-next-line functional/immutable-data
    playerRef.current = player;

    return () => {
      playerRef.current?.dispose();
      // eslint-disable-next-line functional/immutable-data
      playerRef.current = undefined;
    };

    // NOTE: Autoplay is correctly set on initialization only, it should not be a dependency here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.controls, props.playsInline]);

  useEffect(() => {
    if (!playerRef.current) {
      return;
    }

    playerRef.current.autoplay(props.autoplay);
    playerRef.current.controls(props.controls);
    playerRef.current.playsinline(props.playsInline);
    playerRef.current.src(props.src);
    playerRef.current.poster(props.poster || '');

    if (props.autoplay && !props.videoOnDemandStartAt) {
      playerRef.current.play().catch(() => undefined);
    }
  }, [
    props.autoplay,
    props.controls,
    props.playsInline,
    props.poster,
    props.reloadToken,
    props.src,
    props.videoOnDemandStartAt,
  ]);

  useEffect(() => {
    if (!playerRef.current) {
      return;
    }
    const videoOnDemandStartAt =
      typeof props.videoOnDemandStartAt === 'number'
        ? props.videoOnDemandStartAt
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
  }, [props.reloadToken, props.src, props.videoOnDemandStartAt]);

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
