import { render, replace, remove } from '../framework/render.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';
import { UpdateType, UserAction } from '../const.js';
import { isDatesEqual } from '../util/common.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #point = null;
  #pointListView = null;
  #pointComponent = null;
  #pointEditComponent = null;

  #handleModeChange = null;
  #handlePointChange = null;

  #mode = Mode.DEFAULT;

  constructor({ pointListView, onDataChange, onModeChange }) {
    this.#pointListView = pointListView;
    this.#handlePointChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  #handleEditClick() {
    this.#replaceCardToForm();
  }

  #handleFormSubmit = (point) => {
    const isMinor = !isDatesEqual(this.#point.start, point.start) || !isDatesEqual(this.#point.end, point.end);
    this.#handlePointChange(
      UserAction.UPDATE_POINT,
      isMinor ? UpdateType.MINOR : UpdateType.PATCH,
      point
    );
    this.#replaceFormToCard();
  };

  #handleFormClose() {
    this.#replaceFormToCard();
  }

  init({point, offers, destinations}) {
    this.#point = point;
    this.#pointComponent = new PointView({point, offers, destinations, onEditClick: this.#handleEditClick.bind(this)});
    if (!this.#pointEditComponent) {
      this.#pointEditComponent = new PointEditView({point, offers, destinations,
        onFormSubmit: this.#handleFormSubmit.bind(this),
        onFormClose: this.#handleFormClose.bind(this),
        onResetClick: this.#handleResetClick
      });
      render(this.#pointComponent, this.#pointListView.element);
    }
  }

  #handleResetClick = (point) => {
    this.#handlePointChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #replaceCardToForm() {
    this.#handleModeChange();
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

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToCard();
    }
  }
}
