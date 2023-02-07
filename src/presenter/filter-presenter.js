import { FilterType, UpdateType } from '../const.js';
import { remove, render, replace } from '../framework/render';
import { filter } from '../util/filter.js';
import FilterView from '../view/filter-view';


export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #pointsModel = null;

  #filterView = null;

  constructor({ filterContainer, filterModel, pointsModel }) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.init.bind(this));
    this.#filterModel.addObserver(this.init.bind(this));
  }

  init() {
    const prevFilterView = this.#filterView;

    const points = this.#pointsModel.points;
    const filtersEnabled = new Map();
    for(const filterType of Object.values(FilterType)) {
      filtersEnabled.set(filterType, filter[filterType](points).length > 0);
    }
    this.#filterView = new FilterView({
      currentFilterType: this.#filterModel.filterType,
      onFilterTypeChanged: this.#handleFilterChanged,
      filtersEnabled
    });

    if (prevFilterView) {
      replace(this.#filterView, prevFilterView);
      remove(prevFilterView);
    }
    else {
      render(this.#filterView, this.#filterContainer);
    }
  }

  #handleFilterChanged = (filterType) => {
    if (this.#filterModel.filterType !== filterType) {
      this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
    }
  };
}
