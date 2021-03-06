import AbstractView from "./abstract.js";

export default class LoadButton extends AbstractView {
  constructor() {
    super();

    this._clickHandler = this._clickHandler.bind(this);
  }

  _createTemplate() {
    return `<button class="load-more" type="button">load more</button>`;
  }

  getTemplate() {
    return this._createTemplate();
  }

  _clickHandler(evt) {
    evt.preventDefault();

    this._callback.click();
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener(`click`, this._clickHandler);
  }

  removeClickHandler() {
    this.getElement().removeEventListener(`click`, this._clickHandler);
  }
}
