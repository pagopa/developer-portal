import { dateOptions, defaultLocale, timeOptions } from '@/config';

function isSameDay(start: Date, end: Date): boolean {
  return (
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate()
  );
}

/**
 * this function is used to format the date and time
 * in the format defined with dateOptions and timeOptions
 */
function formattedDateTime(date: Date): string {
  return `${date.toLocaleDateString(
    defaultLocale,
    dateOptions
  )}, ${date.toLocaleTimeString(defaultLocale, timeOptions)}`;
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

  if (!start) return end.toLocaleDateString(defaultLocale, dateOptions);

  return isSameDay(start, end)
    ? end.toLocaleTimeString(defaultLocale, timeOptions)
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
