import { render } from '../render.js';
import FilterView from '../view/filter-view.js';
import PointView from '../view/point-view.js';
import SortView from '../view/sort-view.js';
import PointListView from '../view/point-list-view.js';
import PointEditView from '../view/point-edit-view.js';

export default class TripPresenter {
  sortView = new SortView();
  pointListView = new PointListView();

  constructor({ filterContainer, siteMainContainer, pointsModel }) {
    this.filterContainer = filterContainer;
    this.siteMainContainer = siteMainContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    this.points = [...this.pointsModel.getPoints()];

    render(new FilterView(), this.filterContainer);
    render(this.sortView, this.siteMainContainer);
    render(this.pointListView, this.siteMainContainer);
    this.points.forEach((point, index) => {
      if(index === 0) {
        render(new PointEditView(point), this.pointListView.getElement());
      }
      else {
        render(new PointView(point), this.pointListView.getElement());
      }
    });
  }
}
