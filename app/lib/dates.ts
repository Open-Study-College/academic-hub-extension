import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

export const UK_TIMEZONE = 'Europe/London';

export const formatUkDateTime = ({ value }: { value: string }) =>
    dayjs(value).tz(UK_TIMEZONE).format('ddd D MMM YYYY, HH:mm');

export const isPast = ({ value }: { value: string }) => dayjs(value).isBefore(dayjs());
