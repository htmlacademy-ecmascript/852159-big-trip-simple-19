export const POINT_TYPE = {
  TAXI: 'taxi',
  BUS: 'bus',
  TRAIN: 'train',
  SHIP: 'ship',
  DRIVE: 'drive',
  FLIGHT: 'flight',
  CHECK_IN: 'check-in',
  SIGHTSEEING: 'sightseeing',
  RESTAURANT: 'restaurant',
};

export const POINT_TYPE_NAME = {
  [POINT_TYPE.TAXI]: 'Taxi',
  [POINT_TYPE.BUS]: 'Bus',
  [POINT_TYPE.TRAIN]: 'Train',
  [POINT_TYPE.SHIP]: 'Ship',
  [POINT_TYPE.DRIVE]: 'Drive',
  [POINT_TYPE.FLIGHT]: 'Flight',
  [POINT_TYPE.CHECK_IN]: 'Check-in',
  [POINT_TYPE.SIGHTSEEING]: 'Sightseeing',
  [POINT_TYPE.RESTAURANT]: 'Restaurant',
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
  start: new Date(),
  end: new Date(),
  price: 0,
  offers: [1]
};

export function getPointIconUrl(point){
  return `img/icons/${POINT_ICON[point.type]}`;
}
