import { render, replace } from '../framework/render.js';
import FilterView from '../view/filter-view.js';
import PointView from '../view/point-view.js';
import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import PointEditView from '../view/point-edit-view.js';
import NoPointView from '../view/no-point-view.js';

export default class TripPresenter {
  #pointListView = new PointListView();
  #pointsModel = null;
  #points = [];
  #filterContainer = null;
  #siteMainContainer = null;
  #noPointView = new NoPointView();

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
      this.#renderPoint(point);
    });
  }

  #renderPoint(point) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToCard.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointComponent = new PointView({point, onEditClick: () => {
      replaceCardToForm.call(this);
      document.addEventListener('keydown', escKeyDownHandler);
    }});
    const pointEditComponent = new PointEditView({point,
      onFormSubmit: () => {
        replaceFormToCard.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onFormClose: () => {
        replaceFormToCard.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      }});
    function replaceCardToForm() {
      replace(pointEditComponent, pointComponent);
    }

    function replaceFormToCard() {
      replace(pointComponent, pointEditComponent);
    }

    render(pointComponent, this.#pointListView.element);
  }
}
