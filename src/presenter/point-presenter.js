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

  #estimateChanges(point) {
    if (!isDatesEqual(this.#point.start, point.start) || !isDatesEqual(this.#point.end, point.end))
    {
      return UpdateType.MINOR;
    }
    return UpdateType.PATCH;
  }

  #handleFormSubmit = (point) => {
    this.#handlePointChange(
      UserAction.UPDATE_POINT,
      this.#estimateChanges(point),
      point
    );
  };

  #handleFormClose() {
    this.#replaceFormToCard();
  }

  init({point, offers, destinations}) {
    const oldComponent = this.#pointComponent;
    const oldEditComponent = this.#pointEditComponent;

    this.#point = point;
    this.#pointComponent = new PointView({point, offers, destinations, onEditClick: this.#handleEditClick.bind(this)});

    this.#pointEditComponent = new PointEditView({point, offers, destinations,
      onFormSubmit: this.#handleFormSubmit.bind(this),
      onFormClose: this.#handleFormClose.bind(this),
      onResetClick: this.#handleResetClick
    });

    if (!oldComponent && !oldEditComponent) {
      return render(this.#pointComponent, this.#pointListView.element);
    }

    switch(this.#mode) {
      case Mode.DEFAULT:
        replace (this.#pointComponent, oldComponent);
        break;
      case Mode.EDITING:
        replace(this.#pointComponent, oldEditComponent);
        this.#mode = Mode.DEFAULT;
        break;
    }

    remove(oldComponent);
    remove(oldEditComponent);
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

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#pointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  }
}
