import { useEffect, useState } from 'react';
import { Webinar } from '@/lib/types/webinar';

const COMING_SOON_START_TIME_DELTA_MS = 39 * 30 * 60 * 1000;
const CHECK_WEBINAR_STATUS_INTERVAL_MS = 500;
const POLLING_WEBINAR_VIDEO_INTERVAL_MS = 60 * 1000; // every 60 seconds

export enum WebinarState {
  future,
  comingSoon,
  live,
  past,
  unknown,
}

export const useWebinar = () => {
  const [webinar, setWebinar] = useState<Webinar | null>(null);
  const [webinarState, setWebinarState] = useState<WebinarState>(
    WebinarState.unknown
  );
  const [isQuestionFormEnabled, setIsQuestionFormEnabled] =
    useState<boolean>(false);

  const updateIsQuestionFormEnabled = async (url?: string): Promise<void> => {
    const liveUrlPattern = /playback\.live-video.*\.m3u8$/;
    if (!url || !liveUrlPattern.test(url)) {
      setIsQuestionFormEnabled(false);
      return;
    }

    // eslint-disable-next-line functional/no-try-statements
    try {
      const response = await fetch(url, { method: 'GET', cache: 'no-store' });
      setIsQuestionFormEnabled(response.ok);
    } catch {
      setIsQuestionFormEnabled(false);
    }
  };

  const startDateTimestamp =
    webinar?.startDateTime && new Date(webinar.startDateTime).getTime();
  const endDateTimestamp =
    webinar?.endDateTime && new Date(webinar.endDateTime).getTime();

  const handleWebinarState = (): WebinarState => {
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
  };

  useEffect(() => {
    if (webinarState === WebinarState.past) return;
    setWebinarState(handleWebinarState());
    const intervalId = setInterval(() => {
      setWebinarState(handleWebinarState());
    }, CHECK_WEBINAR_STATUS_INTERVAL_MS);

    // Cleanup the intervals when the component is unmounted
    return () => clearInterval(intervalId);
  }, [webinar]);

  useEffect(() => {
    updateIsQuestionFormEnabled(webinar?.playerSrc);
    const pollingIntervalId = setInterval(() => {
      if (
        webinar &&
        [WebinarState.live, WebinarState.comingSoon].includes(webinarState)
      ) {
        updateIsQuestionFormEnabled(webinar.playerSrc);
      }
    }, POLLING_WEBINAR_VIDEO_INTERVAL_MS);

    return () => clearInterval(pollingIntervalId);
  }, [webinarState]);

  return { webinarState, setWebinar, isQuestionFormEnabled };
};
