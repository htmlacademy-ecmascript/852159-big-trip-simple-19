import dayjs from 'dayjs';

// Функция помещает задачи без даты в конце списка,
// возвращая нужный вес для колбэка sort
function getWeightForNullDate(dateA, dateB) {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
}

function sortPointByDate(pointA, pointB) {
  const weight = getWeightForNullDate(pointA.start, pointB.start);

  return weight ?? dayjs(pointA.start).diff(dayjs(pointB.start));
}

function sortPointByPrice(pointA, pointB) {
  const weight = getWeightForNullDate(pointA.price, pointB.price);

  return weight ?? pointB.price - pointA.price;
}

export {sortPointByDate, sortPointByPrice};
