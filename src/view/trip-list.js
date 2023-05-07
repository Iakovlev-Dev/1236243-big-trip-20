import { createElement } from '../render';

function createTripList () {
  return '<ul class="trip-events__list"></ul>';
}

export default class TripList {
  getTemplate() {
    return createTripList();
  }

  getElement() {
    if(!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement () {
    this.element = null;
  }
}