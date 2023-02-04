import { getRandomArrayElement, getRandomInt } from '../util/common';

const DESCS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.'
];

export const TOWNS = [
  'Vienna',
  'Zurich',
  'Calgary',
  'Vancouver',
  'Geneva',
  'Frankfurt',
  'Toronto',
  'Osaka'
];

function getRandomPicture() {
  return `https://loremflickr.com/248/152?random=${getRandomInt(10000)}`;
}

function getRandomDestinationDesceription() {
  return DESCS.filter(() => getRandomInt(2)).join(' ');
}

export const DESTINATIONS_COUNT = 10;

export const mockDestinations = Array.from({length: DESTINATIONS_COUNT}, (elem, index) =>
  Object.assign({
    id: index,
    title: getRandomArrayElement(TOWNS),
    description: getRandomDestinationDesceription(),
    pictures: Array.from({length: getRandomInt(5)}, getRandomPicture)
  })
);

export function getRandomDestination() {
  return getRandomArrayElement(mockDestinations).id;
}

export function getDesination(id) {
  return mockDestinations.find((desc) => desc.id === id);
}
