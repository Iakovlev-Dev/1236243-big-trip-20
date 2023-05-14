import { findDescription } from '../view/trip-point.js';
import AbstractView from '../framework/view/abstract-view.js';
import { humanizeTaskDueDate } from '../utils/dateUtils.js';

const createAvaibleOffers = (offers, offersID, type) => {
  const offerByType = offers.find((offer) => offer.type === type).offers;
  const arrayOffers = [];

  for (let i = 0; i < offerByType.length; i++) {
    const isChecked = offersID.includes(offerByType[i].id) ? 'checked' : '';
    arrayOffers.push(`<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="${offerByType[i].id}" ${isChecked}> 
        <label class="event__offer-label" for="${offerByType[i].id}">
          <span class="event__offer-title">${offerByType[i].title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offerByType[i].price}</span>
        </label>
      </div>`);
  }

  return arrayOffers.join('');
};
const createTypesList = (offers, type) => {
  const typesList = offers.map((offer) => `<div class="event__type-${offer.type}">
    <input id="event-type-${offer.type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${offer.type}" ${offer.type === type ? 'checked' : ''}>
    <label class="event__type-label  event__type-label--${offer.type}" for="event-type-${offer.type}-1">${offer.type}</label>
    </div>`).join('');
  return typesList;
};
const createOptionCity = (dest) => {
  const optionCity = dest.map((item) => `<option value='${item.name}'></option>`);
  return optionCity;
};

const createFotoElement = (destination, dest) => {
  const cityFotos = findDescription(destination, dest).pictures;
  const fotoTemplate = cityFotos.map((item) => `<img class="event__photo" src='${item.src}' alt='${item.description}'></img>`);
  return fotoTemplate;
};

function createTripEditPoint (trip, offers, dest) {

  const {type, offers: offersID, destination, dateFrom, dateTo, basePrice} = trip;
  const dateFormat = 'DD/MM/YY HH:MM';
  const dateStart = humanizeTaskDueDate(dateFrom, dateFormat);
  const dateEnd = humanizeTaskDueDate(dateTo, dateFormat);

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
                ${createTypesList(offers, type)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${findDescription(destination,dest).name}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${createOptionCity(dest)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateStart}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateEnd}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${createAvaibleOffers(offers, offersID, type)}
          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${findDescription(destination,dest).description}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${createFotoElement(destination, dest)}
            </div>
          </div>
        </section>
      </section>
    </form>
  </li>`;
}

export default class TripEditPoint extends AbstractView {
  #trip = null;
  #offer = null;
  #destination = null;
  #handleSubmit = null;
  #handleClick = null;

  constructor ({trip, offers, destination, onSubmit, onClick}) {
    super();
    this.#trip = trip;
    this.#offer = offers;
    this.#destination = destination;
    this.#handleSubmit = onSubmit;
    this.#handleClick = onClick;
    this.element.querySelector('.event').addEventListener('submit', this.#submitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickHandler);
  }

  get template() {
    return createTripEditPoint(this.#trip, this.#offer, this.#destination);
  }

  #submitHandler = (evt) => {
    evt.preventDefault();
    this.#handleSubmit();
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick();
  };
}
