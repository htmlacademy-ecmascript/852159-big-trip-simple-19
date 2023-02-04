import dayjs from 'dayjs';
import { POINT_TYPE } from '../constants/point';
import { getRandomArrayElement, getRandomInt, randomDate } from '../util/common';
import { getRandomDestination } from './destination';
import { getRandomOffers } from './offer';

function generateRandomPoint() {
  const startDate = dayjs('2019-03-01');
  const start = randomDate(startDate);
  const end = randomDate(start);
  return {
    type: getRandomArrayElement(Object.values(POINT_TYPE)),
    destination: getRandomDestination(),
    start,
    end,
    price: getRandomInt(1000),
    offers: getRandomOffers()
  };
}

const POINTS_COUNT = 10;

const mockPoints = Array.from({length: POINTS_COUNT}, generateRandomPoint);

function getRandomPoint() {
  return getRandomArrayElement(mockPoints);
}

export { getRandomPoint };
