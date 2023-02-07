import { remove, render } from '../framework/render.js';
// import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import NoPointView from '../view/no-point-view.js';
import PointPresenter from './point-presenter.js';
import { DEFAULT_SORT_TYPE, FilterType, SortType, UpdateType } from '../const';
import { filter } from '../util/filter.js';
import { sortPointByDate, sortPointByPrice } from '../util/point.js';
import { UserAction } from '../const';
import NewPointPresenter from './new-point-presenter.js';

export default class TripPresenter {
  #pointListView = new PointListView();
  #pointsModel = null;
  #filterContainer = null;
  #siteMainContainer = null;
  #noPointView = null;
  #sortComponent = null;
  #currentSortType = DEFAULT_SORT_TYPE;
  #pointPresenters = new Map();
  #offersModel = null;
  #destinationsModel = null;
  #filterModel = null;
  #onNewPointDestroy = null;
  #filterType = null;
  #newPointPresenter = null;

  constructor({ filterContainer, siteMainContainer, pointsModel,
    offersModel, destinationsModel, filterModel, onNewPointDestroy }) {
    this.#filterContainer = filterContainer;
    this.#siteMainContainer = siteMainContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;
    this.#onNewPointDestroy = onNewPointDestroy;

    this.#newPointPresenter = new NewPointPresenter({
      pointListView: this.#pointListView,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  addNewPoint() {
    if (this.#currentSortType !== SortType.DAY) {
      this.#handleSortTypeChange(SortType.DAY);
    }

    if (this.#filterModel.filterType !== FilterType.EVERYTHING) {
      this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    }

    this.#newPointPresenter.init({
      destinations: this.destinations,
      offers: this.offers
    });
  }

  get points() {
    this.#filterType = this.#filterModel.filterType;
    const points = filter[this.#filterType](this.#pointsModel.points);

    switch (this.#currentSortType) {
      case SortType.PRICE:
        return points.sort(sortPointByPrice);
      default:
        return points.sort(sortPointByDate);
    }
  }

  get offers() {
    return this.#offersModel.offersByType;
  }

  get destinations() {
    return this.#destinationsModel.destinations;
  }

  #handleModelEvent = (updateType, point) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(point.id).init({point, offers: this.offers, destinations: this.destinations });
        break;
      case UpdateType.MINOR:
        this.#clearList();
        this.#renderPointsList();
        break;
      case UpdateType.MAJOR:
        this.#clearList({resetSortType: true});
        this.#renderPointsList();
        break;
    }
  };

  #clearList({resetSortType = false} = {}) {
    // this.#newTaskPresenter.destroy();
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortComponent);

    if (this.#noPointView) {
      remove(this.#noPointView);
    }

    if (resetSortType) {
      this.#currentSortType = DEFAULT_SORT_TYPE;
    }
  }

  init() {
    this.#renderPointsList();
  }

  #renderPointsList() {
    if (this.points.length === 0) {
      this.#noPointView = new NoPointView({filterType: this.#filterModel.filterType});
      render(this.#noPointView, this.#siteMainContainer);
      return;
    }

    this.#renderSort();
    render(this.#pointListView, this.#siteMainContainer);

    this.points.forEach((point) => {
      const pointPresenter = new PointPresenter({
        pointListView: this.#pointListView,
        onDataChange: this.#handleViewAction,
        onModeChange: this.#resetPoints.bind(this),
      });
      pointPresenter.init({point,
        offers: this.offers, destinations:this.destinations});
      this.#pointPresenters.set(point.id, pointPresenter);
    });
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange,
      currentSortType: this.#currentSortType
    });
    render(this.#sortComponent, this.#siteMainContainer);
  }

  #handleSortTypeChange = (sortType) => {
    if (sortType === this.#currentSortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearList();
    this.#renderPointsList();
  };

  #resetPoints() {
    //this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.resetView());
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };
}
