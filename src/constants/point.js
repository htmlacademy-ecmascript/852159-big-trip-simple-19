import dayjs from 'dayjs';

export const POINT_TYPE = {
  TAXI: 'Taxi',
  BUS: 'Bus',
  TRAIN: 'Train',
  SHIP: 'Ship',
  DRIVE: 'Drive',
  FLIGHT: 'Flight',
  CHECK_IN: 'Check-in',
  SIGHTSEEING: 'Sightseeing',
  RESTAURANT: 'Restaurant',
};

export const POINT_TYPE_CLASS_NAME = {
  [POINT_TYPE.TAXI]: 'taxi',
  [POINT_TYPE.BUS]: 'bus',
  [POINT_TYPE.TRAIN]: 'train',
  [POINT_TYPE.SHIP]: 'ship',
  [POINT_TYPE.DRIVE]: 'drive',
  [POINT_TYPE.FLIGHT]: 'flight',
  [POINT_TYPE.CHECK_IN]: 'check.png',
  [POINT_TYPE.SIGHTSEEING]: 'sightseeing',
  [POINT_TYPE.RESTAURANT]: 'restaurant',
};

export const POINT_ICON = {
  [POINT_TYPE.TAXI]: 'taxi.png',
  [POINT_TYPE.BUS]: 'bus.png',
  [POINT_TYPE.TRAIN]: 'train.png',
  [POINT_TYPE.SHIP]: 'ship.png',
  [POINT_TYPE.DRIVE]: 'drive.png',
  [POINT_TYPE.FLIGHT]: 'flight.png',
  [POINT_TYPE.CHECK_IN]: 'check-in.png',
  [POINT_TYPE.SIGHTSEEING]: 'sightseeing.png',
  [POINT_TYPE.RESTAURANT]: 'restaurant.png',
};

export const POINT_DEFAULT = {
  type: POINT_TYPE.BUS,
  destination: 1,
  start: dayjs(),
  end: dayjs(),
  price: 0,
  offers: [1]
};

export function getPointIconUrl(point){
  return `img/icons/${POINT_ICON[point.type]}`;
}
