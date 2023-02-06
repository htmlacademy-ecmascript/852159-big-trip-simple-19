import dayjs from 'dayjs';

function getRandomInt(size) {
  return Math.floor(Math.random() * size);
}

function getRandomArrayElement(items) {
  return items[getRandomInt(items.length)];
}

function randomDate(start, end = null) {
  if (end === null) {
    end = dayjs();
  }
  const fromMilli = dayjs(start).valueOf();
  const max = dayjs(end).valueOf() - fromMilli;
  const dateOffset = Math.floor(Math.random() * max + 1);
  const newDate = dayjs(fromMilli + dateOffset);
  return dayjs(newDate).toDate();
}

const formatDate = (date, format) => dayjs(date).format(format);

export { getRandomArrayElement, getRandomInt, randomDate, formatDate };
