import { DATE_TIME_FORMAT } from '../constants/date-time';
import { getPointIconUrl, POINT_TYPE_NAME } from '../constants/point';
import { formatDate } from '../util/common';
import AbstractView from '../framework/view/abstract-view';

function createOfferTempalte(offer) {
  return (
    `<li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>`);
}

function createPointTemplate(point, offers, destinations) {
  let offersTemplate = '<li class="event__offer">No additional offers</li>';
  if(point.offers.length) {
    offersTemplate = offers.find((offerByType) => offerByType.type === point.type).offers.filter((offer) => point.offers.includes(offer.id)).map((offer) => createOfferTempalte(offer)).join('');
  }
  const pointDestination = destinations.find((dest) => point.destination === dest.id);
  return (`<li class="trip-events__item">
              <div class="event">
                <time class="event__date" datetime="${formatDate(point.start, DATE_TIME_FORMAT.DATE)}">${formatDate(point.start, DATE_TIME_FORMAT.POINT_DATE)}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="${getPointIconUrl(point)}" alt="Event type icon">
                </div>
                <h3 class="event__title">${POINT_TYPE_NAME[point.type]} ${pointDestination.name}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="${point.start.toISOString()}">${formatDate(point.start, DATE_TIME_FORMAT.POINT_TIME)}</time>
                    &mdash;
                    <time class="event__end-time" datetime=${point.end.toISOString()}">${formatDate(point.end, DATE_TIME_FORMAT.POINT_TIME)}</time>
                  </p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${point.price}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
                <ul class="event__selected-offers">
                  ${offersTemplate}
                </ul>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>
            </li>`);
}

export default class PointView extends AbstractView {
  #point = null;
  #offers = null;
  #destinations = null;
  #handleEditClick = null;

  constructor({point, offers, destinations, onEditClick}) {
    super();
    this.#point = point;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#handleEditClick = onEditClick;

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);
  }

  get template() {
    return createPointTemplate(this.#point, this.#offers, this.#destinations);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };
}
