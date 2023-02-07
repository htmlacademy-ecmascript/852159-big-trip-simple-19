import { POINT_TYPE } from '../constants/point';
import { getRandomArrayElement, getRandomInt, randomDate } from '../util/common';
import { getRandomDestination } from './destination';
import { getRandomOffers } from './offer';
import { mockOffersByType } from './offer-by-type';

function generateRandomPoint(id) {
  const start = randomDate('2019-03-01');
  const end = randomDate(start, '2026-10-10');
  const type = getRandomArrayElement(Object.values(POINT_TYPE));
  return {
    id,
    type,
    destination: getRandomDestination(),
    start,
    end,
    price: getRandomInt(1000),
    offers: getRandomOffers(mockOffersByType[type].offers)
  };
}

const POINTS_COUNT = 10;

const mockPoints = Array.from({length: POINTS_COUNT}, (_, id) => generateRandomPoint(id.toString()));

function getRandomPoint() {
  return getRandomArrayElement(mockPoints);
}

function getPoints() {
  return mockPoints;
}

export { getRandomPoint, getPoints };
