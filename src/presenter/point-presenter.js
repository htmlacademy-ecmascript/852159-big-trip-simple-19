import { render, replace } from '../framework/render.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #point = null;
  #pointListView = null;
  #pointComponent = null;
  #pointEditComponent = null;
  #editCallback = null;
  #mode = Mode.DEFAULT;

  constructor({ pointListView, editCallback }) {
    this.#pointListView = pointListView;
    this.#editCallback = editCallback;
  }

  #handleEditClick() {
    this.#editCallback();
    this.#replaceCardToForm();
  }

  #handleFormSubmit() {
    this.#replaceFormToCard();
  }

  #handleFormClose() {
    this.#replaceFormToCard();
  }

  init(point) {
    this.#point = point;
    this.#pointComponent = new PointView({point, onEditClick: this.#handleEditClick.bind(this)});
    this.#pointEditComponent = new PointEditView({point,
      onFormSubmit: this.#handleFormSubmit.bind(this),
      onFormClose: this.#handleFormClose.bind(this)
    });
    render(this.#pointComponent, this.#pointListView.element);
  }

  #replaceCardToForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
    this.#mode = Mode.EDITING;
    document.addEventListener('keydown', this.#escKeyDownHandler.bind(this));
  }

  #replaceFormToCard() {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler.bind(this));
    this.#mode = Mode.DEFAULT;
  }

  #escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceFormToCard();
    }
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToCard();
    }
  }
}
