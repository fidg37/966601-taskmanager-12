import AbstractView from "./abstract.js";

export default class NoTask extends AbstractView {
  _createTemplate() {
    return (
      `<p class="board__no-tasks">
        Click «ADD NEW TASK» in menu to create your first task
      </p>`
    );
  }

  getTemplate() {
    return this._createTemplate();
  }
}
