import dayjs from 'dayjs';

const formatDate = (date, format) => dayjs(date).format(format);
const isDatesEqual = (dateA, dateB) => dayjs(dateA).isSame(dateB, 'D');

export { formatDate, isDatesEqual };
