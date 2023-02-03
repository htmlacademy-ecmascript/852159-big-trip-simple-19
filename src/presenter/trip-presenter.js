import { render } from '../framework/render.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import NoPointView from '../view/no-point-view.js';
import PointPresenter from './point-presenter.js';

export default class TripPresenter {
  #pointListView = new PointListView();
  #pointsModel = null;
  #points = [];
  #filterContainer = null;
  #siteMainContainer = null;
  #noPointView = new NoPointView();
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

    render(new SortView(), this.#siteMainContainer);
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

  #resetPoints() {
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.resetView());
  }
}
