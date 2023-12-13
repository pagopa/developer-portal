import { useEffect, useState } from 'react';
import { Webinar } from '@/lib/types/webinar';

const MILLISECONDS_IN_21_HOURS = 21 * 1000 * 60 * 60;
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
  const [webinarState, setWebinarState] = useState<WebinarState>(
    WebinarState.unknown
  );

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
    if (delta > 0 && delta < MILLISECONDS_IN_21_HOURS) {
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
  }, [webinar]);

  return { webinarState, setWebinar };
};
