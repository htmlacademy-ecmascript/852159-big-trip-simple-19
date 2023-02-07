import { mockOffersByType } from '../mock/offer-by-type';
import Observable from '../framework/observable';

export default class OffersModel extends Observable {
  #offersByType = mockOffersByType;

  get offersByType() {
    return this.#offersByType;
  }
}
