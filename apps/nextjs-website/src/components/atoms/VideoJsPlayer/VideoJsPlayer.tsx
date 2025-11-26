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
  startFromSeconds?: number;
}

const TECH_ORDER_AMAZON_IVS = ['AmazonIVS'];

const VideoJsPlayer = (props: PlayerProps) => {
  console.log('VideoJsPlayer: props.startFromSeconds', props.startFromSeconds);
  const videoEl = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<
    // @ts-expect-error TS2322: Type 'undefined' is not assignable to type 'Player & VideoJSIVSTech & VideoJSQualityPlugin'.
    videojs.Player & VideoJSIVSTech & VideoJSQualityPlugin
  >();

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
  }, []);

  useEffect(() => {
    if (!playerRef.current) {
      return;
    }

    playerRef.current.autoplay(props.autoplay);
    playerRef.current.controls(props.controls);
    playerRef.current.playsinline(props.playsInline);
    playerRef.current.src(props.src);
    playerRef.current.poster(props.poster || '');

    if (props.autoplay && !props.startFromSeconds) {
      playerRef.current.play().catch(() => undefined);
    }
  }, [
    props.autoplay,
    props.controls,
    props.playsInline,
    props.poster,
    props.reloadToken,
    props.src,
    props.startFromSeconds,
  ]);

  useEffect(() => {
    if (!playerRef.current) {
      return;
    }
    const startFromSeconds =
      typeof props.startFromSeconds === 'number' ? props.startFromSeconds : 0;
    console.log('VideoJsPlayer: effective startFromSeconds', startFromSeconds);
    if (startFromSeconds <= 0) {
      return;
    }
    const player = playerRef.current;
    const seekTo = Math.max(startFromSeconds, 0);

    const seekToStart = () => {
      console.log('VideoJsPlayer: attempting seek to', seekTo);
      try {
        player.currentTime(seekTo);
        console.log('VideoJsPlayer: seek command sent');
        if (props.autoplay) {
          player.play().catch(() => undefined);
        }
      } catch (e) {
        console.error('VideoJsPlayer: seek failed', e);
      }
    };

    console.log('VideoJsPlayer: readyState', player.readyState());
    if (player.readyState() > 0) {
      seekToStart();
      return;
    }

    player.one('loadedmetadata', () => {
      console.log('VideoJsPlayer: loadedmetadata fired');
      seekToStart();
    });

    return () => {
      player.off('loadedmetadata', seekToStart);
    };
  }, [props.reloadToken, props.src, props.startFromSeconds, props.autoplay]);

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
