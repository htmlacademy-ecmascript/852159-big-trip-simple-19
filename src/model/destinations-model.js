import { mockDestinations } from '../mock/destination';
import Observable from '../framework/observable';

export default class DestinationsModel extends Observable {
  #destinations = mockDestinations;

  get destinations() {
    return this.#destinations;
  }
}
