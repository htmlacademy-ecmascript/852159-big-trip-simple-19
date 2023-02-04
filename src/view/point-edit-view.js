import { getPointIconUrl, POINT_DEFAULT, POINT_TYPE, POINT_TYPE_CLASS_NAME } from '../constants/point';
import { formatDate } from '../util/common';
import { DATE_TIME_FORMAT } from '../constants/date-time';
import { mockOffers } from '../mock/offer';
import { getDesination, TOWNS } from '../mock/destination';
import AbstractView from '../framework/view/abstract-view';

function createTownsTemplete() {
  return TOWNS.map((town) => `<option value="${town}"></option>`).join('');
}

function createEventTypesTemplate() {
  return Object.keys(POINT_TYPE).map((type, index) =>
    `<div class="event__type-item">
      <input id="event-type-${POINT_TYPE[type]}-${index}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${POINT_TYPE_CLASS_NAME[type]}">
      <label class="event__type-label  event__type-label--${POINT_TYPE_CLASS_NAME[type]}" for="event-type-${POINT_TYPE_CLASS_NAME[type]}-${index}">${POINT_TYPE[type]}</label>
    </div>`).join('');
}

function createOffersTemplate(point) {
  return mockOffers.map((offer, index) =>
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-comfort-${index}" type="checkbox" name="event-offer-comfort" ${point.offers.includes(offer.id) ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-comfort-${index}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`).join('');
}

function createDestinationImagesTemplate(destination) {
  return destination.pictures.map((picture) => `<img class="event__photo" src="${picture}" alt="Event photo">`).join('');
}

function createPointEditTemplate(point) {
  const towns = createTownsTemplete();
  const eventTypes = createEventTypesTemplate();
  const offers = createOffersTemplate(point);
  const destination = getDesination(point.destination);
  const destinationImages = createDestinationImagesTemplate(destination);
  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="${getPointIconUrl(point)}" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
          ${eventTypes}  
        </fieldset>
      </div>
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${point.type}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.title}" list="destination-list-1">
      <datalist id="destination-list-1">
        ${towns}
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatDate(point.start, DATE_TIME_FORMAT.POINT_DATE_TIME)}">
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value=${formatDate(point.end, DATE_TIME_FORMAT.POINT_DATE_TIME)}">
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${point.price}">
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">Delete</button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </header>
  <section class="event__details">
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${offers}
      </div>
    </section>

    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.description}</p>
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${destinationImages}
        </div>
      </div>
    </section>
  </section>
</form></li>`;
}

export default class PointEditView extends AbstractView {
  #point = null;
  #handleFormSubmit = null;
  #handleFormClose = null;

  constructor({ point = POINT_DEFAULT, onFormSubmit, onFormClose }) {
    super();
    this.#point = point;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleFormClose = onFormClose;

    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#formCloseHandler);
  }

  get template() {
    return createPointEditTemplate(this.#point);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit();
  };

  #formCloseHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormClose();
  };
}
