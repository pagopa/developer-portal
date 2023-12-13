import { useEffect, useState } from 'react';
import { Webinar } from '@/lib/types/webinar';

const COMING_SOON_START_TIME_DELTA_MS = 39 * 30 * 60 * 1000;
const CHECK_WEBINAR_STATUS_INTERVAL_MS = 500;

export enum WebinarState {
  future,
  comingSoon,
  live,
  past,
  unknown,
}

export const useWebinar = () => {
  const [webinar, setWebinar] = useState<Webinar | null>(null);
  const [currentTimestamp, setCurrentTimestamp] = useState<number>(
    new Date().getTime()
  );
  const [webinarState, setWebinarState] = useState<WebinarState>(
    WebinarState.unknown
  );

  const startDateTimestamp =
    webinar?.startDateTime && new Date(webinar.startDateTime).getTime();
  const endDateTimestamp =
    webinar?.endDateTime && new Date(webinar.endDateTime).getTime();

  const handleWebinarState = (): WebinarState => {
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

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [webinar, currentTimestamp]);

  return { webinarState, setWebinar };
};
