import { isSameDay } from 'date-fns';

const DEFAULT_LOCALE = 'it-IT';

const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

const TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  hour: '2-digit',
  minute: '2-digit',
};

/**
 * this function is used to format the date and time
 * in the format defined with DATE_OPTIONS and TIME_OPTIONS
 */
function formattedDateTime(date: Date): string {
  return `${date.toLocaleDateString(
    DEFAULT_LOCALE,
    DATE_OPTIONS
  )}, ${date.toLocaleTimeString(DEFAULT_LOCALE, TIME_OPTIONS)}`;
}

/**
 * this function is used to return a formatted end date of the slot
 * it always shows time, but it shows the date only if end is different from start date
 */
function conditionallyFormattedEndDate(
  start?: Date,
  end?: Date
): string | undefined {
  if (!end) return;

  if (!start) return end.toLocaleDateString(DEFAULT_LOCALE, DATE_OPTIONS);

  return isSameDay(start, end)
    ? end.toLocaleTimeString(DEFAULT_LOCALE, TIME_OPTIONS)
    : formattedDateTime(end);
}

type TimeSlotProps = {
  start?: Date;
  end?: Date;
};

const TimeSlot = ({ start, end }: TimeSlotProps) => {
  return [
    start && formattedDateTime(start),
    conditionallyFormattedEndDate(start, end),
  ]
    .filter(Boolean)
    .join(' - ');
};

export default TimeSlot;
