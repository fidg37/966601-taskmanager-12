import AbstractView from "./abstract.js";

export default class LoadButton extends AbstractView {
  _createTemplate() {
    return `<button class="load-more" type="button">load more</button>`;
  }

  getTemplate() {
    return this._createTemplate();
  }
}
