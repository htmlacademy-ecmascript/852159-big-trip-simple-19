import { render } from '../framework/render.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import NoPointView from '../view/no-point-view.js';
import PointPresenter from './point-presenter.js';
import { DEFAULT_SORT_TYPE, SortType } from '../constants/sort.js';
import { sortPointByDate, sortPointByPrice } from '../util/point.js';

export default class TripPresenter {
  #pointListView = new PointListView();
  #pointsModel = null;
  #points = [];
  #filterContainer = null;
  #siteMainContainer = null;
  #noPointView = new NoPointView();
  #sortComponent = null;
  #currentSortType = null;
  #pointPresenters = [];

  constructor({ filterContainer, siteMainContainer, pointsModel }) {
    this.#filterContainer = filterContainer;
    this.#siteMainContainer = siteMainContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#points = [...this.#pointsModel.points];
    render(new FilterView({points: this.#points}), this.#filterContainer);

    if (this.#points.length === 0) {
      render(this.#noPointView, this.#siteMainContainer);
      return;
    }

    this.#sortPoints(DEFAULT_SORT_TYPE);
    this.#renderSort();
    this.#renderPointsList();
  }

  #renderPointsList() {
    render(this.#pointListView, this.#siteMainContainer);
    this.#points.forEach((point) => {
      const pointPresenter = new PointPresenter({
        pointListView: this.#pointListView,
        editCallback: this.#resetPoints.bind(this)
      });
      pointPresenter.init(point);
      this.#pointPresenters.push(pointPresenter);
    });
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange,

    });
    render(this.#sortComponent, this.#siteMainContainer);
  }

  #sortPoints (sortType) {
    if (sortType === SortType.DAY) {
      this.#points.sort(sortPointByDate);
    } else {
      this.#points.sort(sortPointByPrice);
    }
    this.#currentSortType = sortType;
  }

  #clearPointsList() {
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.destroy());
    this.#pointPresenters = [];
  }

  #handleSortTypeChange = (sortType) => {
    if (sortType === this.#currentSortType) return;
    this.#sortPoints(sortType);
    this.#clearPointsList();
    this.#renderPointsList();
  };

  #resetPoints() {
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.resetView());
  }
}
