import { DATE_TIME_FORMAT } from '../constants/date-time';
import { getPointIconUrl, POINT_TYPE } from '../constants/point';
import { formatDate } from '../utils';
import { mockOffers } from '../mock/offer';
import { getDesination } from '../mock/destination';
import AbstractView from '../framework/view/abstract-view';

function createOfferTempalte(offer) {
  return (
    `<li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>`);
}

function createPointTemplate(point) {
  let offers = '<li class="event__offer">No additional offers</li>';
  if(point.offers.length) {
    offers = Array.from(point.offers, (id) => createOfferTempalte(mockOffers[id])).join('');
  }
  const destination = getDesination(point.destination);
  return (`<li class="trip-events__item">
              <div class="event">
                <time class="event__date" datetime="${formatDate(point.start, DATE_TIME_FORMAT.DATE)}">${formatDate(point.start, DATE_TIME_FORMAT.POINT_DATE)}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="${getPointIconUrl(point)}" alt="Event type icon">
                </div>
                <h3 class="event__title">${point.type} ${destination.title}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="${formatDate(point.start, DATE_TIME_FORMAT.DATETIME)}">${formatDate(point.start, DATE_TIME_FORMAT.POINT_TIME)}</time>
                    &mdash;
                    <time class="event__end-time" datetime=${formatDate(point.end, DATE_TIME_FORMAT.DATETIME)}">${formatDate(point.end, DATE_TIME_FORMAT.POINT_TIME)}</time>
                  </p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${point.price}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
                <ul class="event__selected-offers">
                  ${offers}
                </ul>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>
            </li>`);
}

export default class PointView extends AbstractView {
  #point = null;
  #handleEditClick = null;

  constructor({point, onEditClick}) {
    super();
    this.#point = point;
    this.#handleEditClick = onEditClick;

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);
  }

  get template() {
    return createPointTemplate(this.#point);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };
}
