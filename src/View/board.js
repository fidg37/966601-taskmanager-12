import AbstractView from "./abstract.js";

export default class Board extends AbstractView {

  _createTemplate() {
    return (`<section class="board container">
      <div class="board__tasks"></div>
    </section>`);
  }

  getTemplate() {
    return this._createTemplate();
  }
}
