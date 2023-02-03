import dayjs from 'dayjs';
import AbstractView from '../framework/view/abstract-view';

class Filter {
  _points = null;
  _name = '';
  _value = '';
  _checked = false;
  _disabled = false;
  _noPointsMessage = 'Click New Event to create your first point';

  constructor({points}) {
    this._points = points;
  }

  get enabled() {
    return this._checked;
  }

  set enabled(value) {
    this._checked = value;
  }

  get points() {
    return this._points;
  }

  get noPointsMessage() {
    return this._noPointsMessage;
  }

  get template() {
    const isDisabled = this._disabled ? 'disabled' : '';
    const isChecked = this._checked ? 'checked' : '';
    return `<div class="trip-filters__filter">
        <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${this._value}" ${isDisabled} ${isChecked}>
        <label class="trip-filters__filter-label" for="filter-future">${this._name}</label>
      </div>`;
  }
}

class EverythingFilter extends Filter {
  constructor({points}) {
    super({points});
    this._name = 'Everything';
    this._value = 'everything';
  }
}

class FutureFilter extends Filter {
  constructor({points}) {
    super({points});
    this._name = 'Future';
    this._value = 'future';
    this._noPointsMessage = 'There are no future events now';
    this._points = points.filter((point) => dayjs().isBefore(point.end));
    if (!this._points.length) {
      this._disabled = true;
    }
  }
}

function createFilterTemplate(points, filters) {
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
  #enabledFilter = null;
  #filters = [];

  constructor({points}) {
    super();
    this.#points = points;
    this.#filters = [ new EverythingFilter({points}),
      new FutureFilter({points})];
    this.#enabledFilter = this.#filters[0];
    this.#enabledFilter.enabled = true;
  }

  get template() {
    return createFilterTemplate(this.#points, this.#filters.map((filter) => filter.template).join(' '));
  }
}
