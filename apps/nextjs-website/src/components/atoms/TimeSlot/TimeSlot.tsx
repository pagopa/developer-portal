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

function formattedDateTime(date: Date): string {
  return `${new Date(date).toLocaleDateString(
    DEFAULT_LOCALE,
    DATE_OPTIONS
  )}, ${new Date(date).toLocaleTimeString(DEFAULT_LOCALE, TIME_OPTIONS)}`;
}

function conditionallyFormattedEndDate(
  start?: Date,
  end?: Date
): string | undefined {
  if (!end) return;

  if (!start)
    return new Date(end).toLocaleDateString(DEFAULT_LOCALE, DATE_OPTIONS);

  return isSameDay(start, end)
    ? new Date(end).toLocaleTimeString(DEFAULT_LOCALE, TIME_OPTIONS)
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
