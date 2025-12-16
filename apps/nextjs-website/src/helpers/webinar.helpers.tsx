import { useCallback, useEffect, useMemo, useState } from 'react';
import { Webinar } from '@/lib/types/webinar';

const COMING_SOON_START_TIME_DELTA_MS = 39 * 30 * 60 * 1000; // 19.5 hours
const CHECK_WEBINAR_STATUS_INTERVAL_MS = 500;
const POLLING_WEBINAR_VIDEO_INTERVAL_MS = 60 * 1000; // every 60 seconds
const LIVE_STREAM_URL_PATTERN = /playback\.live-video.*\.m3u8$/;

export enum WebinarState {
  future,
  comingSoon,
  live,
  past,
  unknown,
}

export const useWebinar = () => {
  // Setter is called setWebinarData because the real setter is at line 29, triggering side effects upon change
  const [webinar, setWebinarData] = useState<Webinar | null>(null);
  const [webinarState, setWebinarState] = useState<WebinarState>(
    WebinarState.unknown
  );
  const [isQuestionFormEnabled, setIsQuestionFormEnabled] =
    useState<boolean>(false);
  const [isPlayerVisible, setIsPlayerVisible] = useState<boolean>(false);
  const [isLiveStreamAvailable, setIsLiveStreamAvailable] = useState(false);
  const [livePlayerReloadToken, setLivePlayerReloadToken] = useState(0);

  const setWebinar = (nextWebinar: Webinar | null) => {
    const hasChanged = nextWebinar?.slug !== webinar?.slug;
    setWebinarData(nextWebinar);
    if (hasChanged) {
      setIsQuestionFormEnabled(false);
      setIsPlayerVisible(false);
      setIsLiveStreamAvailable(false);
      setLivePlayerReloadToken(0);
    }
  };

  const updateLiveStreamState = useCallback(
    async (url?: string): Promise<void> => {
      if (!url || !LIVE_STREAM_URL_PATTERN.test(url)) {
        setIsQuestionFormEnabled(false);
        return;
      }

      // eslint-disable-next-line functional/no-try-statements
      try {
        const response = await fetch(url, { method: 'GET', cache: 'no-store' });
        if (response.ok) {
          setIsQuestionFormEnabled(true);
          if (!isLiveStreamAvailable) {
            setIsLiveStreamAvailable(true);
            setLivePlayerReloadToken((token) => token + 1);
          }
        } else {
          setIsQuestionFormEnabled(false);
          if (isLiveStreamAvailable) {
            setIsLiveStreamAvailable(false);
          }
        }
      } catch {
        setIsQuestionFormEnabled(false);
        if (isLiveStreamAvailable) {
          setIsLiveStreamAvailable(false);
        }
      }
    },
    [isLiveStreamAvailable]
  );

  const isLiveStreamSource = useMemo(() => {
    if (!webinar?.playerSrc) {
      return false;
    }
    return LIVE_STREAM_URL_PATTERN.test(webinar.playerSrc);
  }, [webinar?.playerSrc]);

  const startDateTimestamp =
    webinar?.startDateTime && new Date(webinar.startDateTime).getTime();
  const endDateTimestamp =
    webinar?.endDateTime && new Date(webinar.endDateTime).getTime();

  const handleWebinarState = useCallback((): WebinarState => {
    const currentTimestamp = new Date().getTime();
    if (!webinar || !startDateTimestamp || !endDateTimestamp) {
      return WebinarState.unknown;
    }
    if (endDateTimestamp < currentTimestamp) return WebinarState.past;

    const delta = startDateTimestamp - currentTimestamp;
    if (delta > 0 && delta < COMING_SOON_START_TIME_DELTA_MS) {
      return WebinarState.comingSoon;
    }
    if (
      startDateTimestamp <= currentTimestamp &&
      endDateTimestamp >= currentTimestamp
    ) {
      return WebinarState.live;
    }
    if (startDateTimestamp > currentTimestamp) return WebinarState.future;
    return WebinarState.unknown;
  }, [webinar, startDateTimestamp, endDateTimestamp]);

  useEffect(() => {
    if (webinarState === WebinarState.past) return;
    setWebinarState(handleWebinarState());
    const intervalId = setInterval(() => {
      setWebinarState(handleWebinarState());
    }, CHECK_WEBINAR_STATUS_INTERVAL_MS);

    // Cleanup the intervals when the component is unmounted
    return () => clearInterval(intervalId);
  }, [webinar, webinarState, handleWebinarState]);

  useEffect(() => {
    if (!webinar?.playerSrc) {
      setIsPlayerVisible(false);
      setIsQuestionFormEnabled(false);
      return;
    }

    if (!isLiveStreamSource) {
      setIsPlayerVisible(true);
      setIsQuestionFormEnabled(false);
      return;
    }

    const currentTimestamp = new Date().getTime();
    const startDateTimestamp =
      !!webinar?.startDateTime && new Date(webinar.startDateTime).getTime();

    const isLiveStreamOnAir =
      isLiveStreamAvailable &&
      !!startDateTimestamp &&
      startDateTimestamp < currentTimestamp;

    const shouldShowIvsPlayer =
      [WebinarState.live, WebinarState.comingSoon].includes(webinarState) ||
      isLiveStreamOnAir;
    setIsPlayerVisible(shouldShowIvsPlayer);
    setIsQuestionFormEnabled(isLiveStreamOnAir);

    const shouldPollLiveStream =
      [WebinarState.live, WebinarState.comingSoon].includes(webinarState) ||
      isLiveStreamOnAir;

    updateLiveStreamState(webinar.playerSrc);

    if (!shouldPollLiveStream) {
      return;
    }

    const pollingIntervalId = setInterval(() => {
      updateLiveStreamState(webinar.playerSrc);
    }, POLLING_WEBINAR_VIDEO_INTERVAL_MS);

    return () => clearInterval(pollingIntervalId);
  }, [
    webinar?.playerSrc,
    webinar?.startDateTime,
    webinarState,
    isLiveStreamAvailable,
    updateLiveStreamState,
    isLiveStreamSource,
  ]);

  return {
    webinarState,
    setWebinar,
    isQuestionFormEnabled,
    isPlayerVisible,
    isLiveStreamAvailable,
    livePlayerReloadToken,
  };
};
