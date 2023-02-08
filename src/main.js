import PointsModel from './model/points-model';
import FilterModel from './model/filter-model';

import TripPresenter from './presenter/trip-presenter';
import FilterPresenter from './presenter/filter-presenter';
import NewPointButtonView from './view/new-point-button-view';

import { render } from './framework/render.js';
import PointApiService from './point-api-service';
import { AUTHORIZATION, ENDPOINT } from './const';

const filterModel = new FilterModel();
const pointsModel = new PointsModel(new PointApiService(ENDPOINT, AUTHORIZATION));

const tripMainElement = document.querySelector('.trip-main');

const siteFilterElement = tripMainElement.querySelector('.trip-controls');
const siteMainElement = document.querySelector('.trip-events');
const tripPresenter = new TripPresenter({
  filterContainer: siteFilterElement,
  siteMainContainer: siteMainElement,
  pointsModel,
  filterModel,
  onNewPointDestroy: handleNewPointDestroy
});

const filterPresenter = new FilterPresenter({
  filterContainer: tripMainElement.querySelector('.trip-controls__filters'),
  filterModel,
  pointsModel
});

const newPointButtonView = new NewPointButtonView({onClick: handleNewPoint});

function handleNewPoint() {
  tripPresenter.addNewPoint();
  newPointButtonView.disable();
}

function handleNewPointDestroy() {
  newPointButtonView.enable();
}

pointsModel.init().finally(() => {
  render(newPointButtonView, tripMainElement);
});

filterPresenter.init();
tripPresenter.init();
