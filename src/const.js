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
};

export { FilterType, SortType, DEFAULT_SORT_TYPE, UserAction, UpdateType };
