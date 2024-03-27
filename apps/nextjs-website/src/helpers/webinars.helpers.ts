import { Webinar } from '@/lib/types/webinar';

export const getFutureWebinars = (
  webinars: readonly Webinar[]
): readonly Webinar[] =>
  webinars
    .filter(({ startDateTime }) => {
      const startDateTimestamp =
        startDateTime && new Date(startDateTime).getTime();
      return !startDateTimestamp || startDateTimestamp > new Date().getTime();
    })
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    .sort((a, b) => (a.startDateTime! < b.startDateTime! ? 1 : -1));

export const getPastWebinars = (
  webinars: readonly Webinar[]
): readonly Webinar[] =>
  webinars
    .filter(({ startDateTime }) => {
      const startDateTimestamp =
        startDateTime && new Date(startDateTime).getTime();
      return startDateTimestamp && startDateTimestamp < new Date().getTime();
    })
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    .sort((a, b) => (a.startDateTime! < b.startDateTime! ? 1 : -1));
