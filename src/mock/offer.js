import { getRandomArrayElement, getRandomInt } from '../util/common';
import { DESTINATIONS_COUNT } from './destination';

const TITLES = [
  'Add breakfast',
  'Add luggage',
  'Book tickets',
  'Lunch in city',
  'No additional offers',
  'Order Uber',
  'Rent a car',
  'Switch to comfort',
];

const PRICES = [
  20,
  30,
  40,
  50,
  80,
  100,
  200
];

const mockOffers = Array.from({length: DESTINATIONS_COUNT}, (elem, index) =>
  Object.assign({
    id: index,
    title: getRandomArrayElement(TITLES),
    price: getRandomArrayElement(PRICES)
  })
);

function getRandomOffer() {
  return getRandomArrayElement(mockOffers);
}

function getRandomOffers(offersOfType) {
  function unique(value, index, self) {
    return self.indexOf(value) === index;
  }
  return Array.from({length: getRandomInt(5)}, () => getRandomArrayElement(offersOfType)).map((item)=>item.id).filter(unique);
}

export { getRandomOffer, getRandomOffers, mockOffers };
