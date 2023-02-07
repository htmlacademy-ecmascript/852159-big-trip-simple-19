import { POINT_TYPE } from '../constants/point';
import { getRandomInt } from '../util/common';
import { mockOffers } from './offer';

function pickRandomOffers() {
  return mockOffers.filter(() => getRandomInt(2));
}

function generateOffersByType() {
  const _mockOffersObject = {};
  Object.values(POINT_TYPE).forEach((pointType) => {
    _mockOffersObject[pointType] = {
      type: pointType,
      offers: pickRandomOffers()
    };});
  return _mockOffersObject;
}

export const mockOffersByType = generateOffersByType();

