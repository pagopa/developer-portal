const DEFAULT_LOCALE = 'it-IT';

const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'Europe/Rome',
};

const TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  hour: '2-digit',
  minute: '2-digit',
};

function isSameDay(start: Date, end: Date): boolean {
  return (
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate()
  );
}

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
  start?: string;
  end?: string;
};

const TimeSlot = ({ start, end }: TimeSlotProps) => {
  const startDate = start ? new Date(start) : undefined;
  const endDate = end ? new Date(end) : undefined;
  return [
    startDate && formattedDateTime(startDate),
    conditionallyFormattedEndDate(startDate, endDate),
  ]
    .filter(Boolean)
    .join(' - ');
};

export default TimeSlot;
