import { FilterType } from '../const';
import AbstractView from '../framework/view/abstract-view';

const FiltersDataByType = {
  [FilterType.EVERYTHING]: {
    name: 'Everything',
    value: FilterType.EVERYTHING,
    checked: false,
    disabled: false,
  },
  [FilterType.FUTURE]: {
    name: 'Future',
    value: FilterType.FUTURE,
    checked: false,
    disabled: false,
  }
};
Object.freeze(FiltersDataByType);

function createFilterTemplate(filters) {
  return (
    `<div class="trip-controls__filters">
      <h2 class="visually-hidden">Filter events</h2>
      <form class="trip-filters" action="#" method="get">
        ${filters}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>
    </div>`
  );
}

export default class FilterView extends AbstractView {
  #points = null;
  #onFilterTypeChanged = null;
  #filters = {
    [FilterType.EVERYTHING]: {
      name: 'Everything',
      value: FilterType.EVERYTHING,
      checked: false,
      disabled: false,
    },
    [FilterType.FUTURE]: {
      name: 'Future',
      value: FilterType.FUTURE,
      checked: false,
      disabled: false,
    }
  };

  constructor({currentFilterType, onFilterTypeChanged, filtersEnabled}) {
    super();
    this.#filters[currentFilterType].checked = true;
    for(const filterType of Object.values(FilterType)) {
      this.#filters[filterType].disabled = filtersEnabled[filterType] === false;
    }

    this.#onFilterTypeChanged = onFilterTypeChanged;
    this.element.addEventListener('change', this.#filterTypeChangeHandler.bind(this));
  }

  #filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this.#onFilterTypeChanged(evt.target.value);
  }

  get template() {
    const filtersTemplate = Object.values(this.#filters).map((filterObject) => {
      const isDisabled = filterObject.disabled ? 'disabled' : '';
      const isChecked = filterObject.checked ? 'checked' : '';
      return `<div class="trip-filters__filter">
          <input id="filter-${filterObject.value}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filterObject.value}" ${isDisabled} ${isChecked}>
          <label class="trip-filters__filter-label" for="filter-${filterObject.value}">${filterObject.name}</label>
        </div>`;
    }).join('');
    return createFilterTemplate(filtersTemplate);
  }
}
