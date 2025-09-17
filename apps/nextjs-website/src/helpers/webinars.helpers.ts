import { Webinar } from '@/lib/types/webinar';

export const getFutureWebinars = (
  webinars: readonly Webinar[]
): readonly Webinar[] =>
  webinars.filter(
    ({ startDateTime, endDateTime }) =>
      (!startDateTime && !endDateTime) ||
      (endDateTime && new Date(endDateTime).getTime() > new Date().getTime())
  );

export const getPastWebinars = (
  webinars: readonly Webinar[]
): readonly Webinar[] =>
  webinars
    .filter(
      ({ endDateTime, startDateTime }) =>
        endDateTime &&
        startDateTime &&
        new Date(endDateTime).getTime() <= new Date().getTime()
    )
    .sort((a, b) =>
      a.startDateTime && b.startDateTime && a.startDateTime < b.startDateTime
        ? 1
        : -1
    );
