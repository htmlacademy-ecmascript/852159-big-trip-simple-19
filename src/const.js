const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
};

const SortType = {
  PRICE: 'price',
  DAY: 'day',
};

const DEFAULT_SORT_TYPE = SortType.DAY;

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT'
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  ERROR: 'ERROR',
};

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

const ENDPOINT = 'https://19.ecmascript.pages.academy/big-trip-simple';
const AUTHORIZATION = 'Basic eo0w590ik29889aUPl34s3D0nt1Us3I7';

export { FilterType, SortType, DEFAULT_SORT_TYPE, UserAction, UpdateType, ENDPOINT, AUTHORIZATION, TimeLimit };
