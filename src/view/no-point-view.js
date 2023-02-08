import { FilterType } from '../const';
import AbstractView from '../framework/view/abstract-view';

const messageForFilter = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
};

function createNoPointTemplate(filterType) {
  return `<p class="trip-events__msg">${messageForFilter[filterType]}</p>`;
}
export default class NoPointView extends AbstractView {
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoPointTemplate(this.#filterType);
  }
}
