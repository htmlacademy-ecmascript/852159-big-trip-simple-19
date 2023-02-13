import { UpdateType, UserAction } from '../const';
import { remove, render, RenderPosition } from '../framework/render';
import PointEditView from '../view/point-edit-view';


export default class NewPointPresenter {
  #pointListView = null;
  #onDataChange = null;
  #onDestroy = null;

  #pointAddView = null;

  constructor({pointListView, onDataChange, onDestroy}) {
    this.#pointListView = pointListView;
    this.#onDataChange = onDataChange;
    this.#onDestroy = onDestroy;
  }


  init({destinations, offers}) {
    if (this.#pointAddView) {
      return;
    }

    this.#pointAddView = new PointEditView({
      onFormSubmit: this.#handleFormSubmit,
      onFormClose: this.destroy.bind(this),
      onResetClick: this.destroy.bind(this),
      destinations,
      offers
    });

    render(this.#pointAddView, this.#pointListView.element, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (!this.#pointAddView) {
      return;
    }
    remove(this.#pointAddView);
    this.#pointAddView = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#onDestroy();
  }

  #handleFormSubmit = (point) => {
    this.#onDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {...point},
    );
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };

  setSaving() {
    this.#pointAddView.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#pointAddView.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };
    this.#pointAddView.shake(resetFormState);
  }

}
