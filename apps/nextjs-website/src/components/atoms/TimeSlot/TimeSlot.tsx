import {
  longDateOptions,
  timeSlotDateOptions,
  timeSlotTimeOptions,
} from '@/config';
import { useFormatter } from 'next-intl';

function isSameDay(start: Date, end: Date): boolean {
  return (
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate()
  );
}

type TimeSlotProps = {
  start?: string;
  end?: string;
};

const TimeSlot = ({ start, end }: TimeSlotProps) => {
  const format = useFormatter();
  const startDate = start ? new Date(start) : undefined;
  const endDate = end ? new Date(end) : undefined;

  const formattedDateTime = (date: Date) =>
    format.dateTime(date, timeSlotDateOptions);

  const conditionallyFormattedEndDate = (
    start?: Date,
    end?: Date
  ): string | undefined => {
    if (!end) return;

    if (!start) return format.dateTime(end, longDateOptions);

    return isSameDay(start, end)
      ? format.dateTime(end, timeSlotTimeOptions)
      : formattedDateTime(end);
  };

  return [
    startDate && formattedDateTime(startDate),
    conditionallyFormattedEndDate(startDate, endDate),
  ]
    .filter(Boolean)
    .join(' - ');
};

export default TimeSlot;
