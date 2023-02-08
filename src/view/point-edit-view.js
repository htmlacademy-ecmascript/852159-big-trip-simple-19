import flatpickr from 'flatpickr';
import { getPointIconUrl, POINT_TYPE, POINT_TYPE_NAME } from '../constants/point';
import { formatDate } from '../util/common';
import { DATE_TIME_FORMAT } from '../constants/date-time';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';

import 'flatpickr/dist/flatpickr.min.css';

const BLANK_DESTINATION = {
  name: '',
  desciption: '',
  pictures: []
};

const BLANK_POINT = {
  type: POINT_TYPE.TAXI,
  destination: null,
  start: new Date(),
  end: new Date(),
  price: 0,
  offers: [],
};


function createTownsTemplete(destinations) {
  return destinations.map((destination) => `<option value="${destination.name}"></option>`).join('');
}

function createEventTypesTemplate(point) {
  return Object.values(POINT_TYPE).map((type, index) =>
    `<div class="event__type-item">
      <input id="event-type-${type}-${index}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${point.type === type ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${index}">${POINT_TYPE_NAME[type]}</label>
    </div>`).join('');
}

function createOffersTemplate(point, offers) {
  const offersOfType = offers.find((offerByType) => offerByType.type === point.type).offers;
  const offersById = new Map();
  offersOfType.map((offer) => offersById.set(offer.id, offer));
  return offersOfType.map((offer, index) =>
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-comfort-${index}" type="checkbox" name="event-offer-comfort" ${point.offers.includes(offer.id) ? 'checked' : ''} data-offer-id="${offer.id}">
      <label class="event__offer-label" for="event-offer-comfort-${index}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`).join('');
}

function createDestinationImagesTemplate(destination) {
  return destination.pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('');
}

function createPointEditTemplate(point, offers, destinations) {
  const offersOfType = offers.find((offerByType) => offerByType.type === point.type).offers;
  let pointDestination = destinations.find((destination) => destination.id === point.destination);
  if (!pointDestination) {
    pointDestination = BLANK_DESTINATION;
  }
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
          ${createEventTypesTemplate(point)}  
        </fieldset>
      </div>
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${POINT_TYPE_NAME[point.type]}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${pointDestination.name}" list="destination-list-1" required>
        <datalist id="destination-list-1">
          ${createTownsTemplete(destinations)}
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
      <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${point.price}" required>
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">${point.editPoint ? 'Delete' : 'Cancel' }</button>
    ${point.editPoint ? `<button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>` : '' }
  </header>
  <section class="event__details">
  ${ (offersOfType && offersOfType.length) ?
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${createOffersTemplate(point, offers)}
      </div>
    </section>` : ''}

  ${(pointDestination && pointDestination.description) ?
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${pointDestination.description}</p>
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${createDestinationImagesTemplate(pointDestination)}
        </div>
      </div>
    </section>` : ''}
  </section>
</form></li>`;
}

export default class PointEditView extends AbstractStatefulView {
  #handleFormSubmit = null;
  #handleFormClose = null;
  #handleResetClick = null;

  #datepickerStart = null;
  #datepickerEnd = null;

  #offers = null;
  #destinations = null;


  constructor({ point = BLANK_POINT, offers, destinations, onFormSubmit, onFormClose, onResetClick }) {
    super();

    this.#offers = offers;
    this.#destinations = destinations;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleFormClose = onFormClose;
    this.#handleResetClick = onResetClick;
    this._setState(PointEditView.parsePointToState(point));

    this._restoreHandlers();
  }

  #setDatepickerStart() {
    this.#datepickerStart = flatpickr(
      this.element.querySelector('input[name=event-start-time]'),
      {
        dateFormat: 'j/m/y H:i',
        defaultDate: this._state.start,
        onChange: this.#startChangeHandler.bind(this),
        enableTime: true,
        maxDate: this._state.end
      }
    );
  }

  #startChangeHandler([start]) {
    this.#datepickerEnd.set('minDate', start);
    this._setState({ start });
  }

  #setDatepickerEnd() {
    this.#datepickerEnd = flatpickr(
      this.element.querySelector('input[name=event-end-time]'),
      {
        dateFormat: 'j/m/y H:i',
        defaultDate: this._state.end,
        onChange: this.#endChangeHandler.bind(this),
        enableTime: true,
        minDate: this._state.start,
      }
    );
  }

  #endChangeHandler([end]) {
    this.#datepickerStart.set('maxDate', end);
    this._setState({ end });
  }

  get template() {
    return createPointEditTemplate(this._state, this.#offers, this.#destinations);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(PointEditView.parseStateToPoint(this._state));
  };

  #formCloseHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormClose();
  };

  reset(point) {
    this.updateElement(
      PointEditView.parsePointToState(point),
    );
  }

  #offersChangeHandler(evt) {
    evt.preventDefault();
    const currentOfferId = Number(evt.target.dataset.offerId);
    const { offers } = this._state;

    const currentOfferIndex = offers.indexOf(currentOfferId);

    const updatedOffers = currentOfferIndex === -1
      ? offers.concat(currentOfferId)
      : offers.slice().splice(currentOfferIndex, 1);

    this._setState({ offers: updatedOffers });
  }

  #pointTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offers: []
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const selectedDestination = this.#destinations.find((destination) => evt.target.value === destination.name);
    if (selectedDestination !== null) {
      this.updateElement({
        destination: selectedDestination.id,
      });
    }
  };

  #formResetClickHandler = (evt) => {
    evt.preventDefault();

    this.#handleResetClick(PointEditView.parseStateToPoint(this._state));
  };


  _restoreHandlers() {
    const element = this.element;
    const eventRollupBtn = element.querySelector('.event__rollup-btn');
    const eventAvailableOffers = element.querySelector('.event__available-offers');

    if (eventRollupBtn) {
      eventRollupBtn.addEventListener('click', this.#formCloseHandler.bind(this));
    }
    if (eventAvailableOffers) {
      eventAvailableOffers.addEventListener('change', this.#offersChangeHandler.bind(this));
    }

    element.querySelector('form').addEventListener('submit', this.#formSubmitHandler.bind(this));
    element.querySelector('.event__type-group').addEventListener('change', this.#pointTypeChangeHandler.bind(this));
    element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler.bind(this));
    element.querySelector('.event__input--price').addEventListener('input', this.#priceInputHandler);

    const eventResetBtn = element.querySelector('.event__reset-btn');
    if (eventResetBtn) {
      eventResetBtn.addEventListener('click', this.#formResetClickHandler);
    }

    this.#setDatepickerStart();
    this.#setDatepickerEnd();
  }

  #priceInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      price: parseInt( evt.target.value, 10 )
    });
  };

  static parsePointToState(point) {
    return {...point,
      editPoint: Object.hasOwn(point, 'id')
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};
    delete point.editPoint;
    return point;
  }

}
