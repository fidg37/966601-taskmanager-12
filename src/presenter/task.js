import TaskCardView from "../view/task-card.js";
import TaskCardEditView from "../view/task-card-edit.js";
import {render, replace} from "../utils/render.js";

export default class Task {
  constructor(taskContainer) {
    this._taskContainer = taskContainer;

    this._taskComponent = null;
    this._taskEditComponent = null;

    this._onEditButtonClick = this._onEditButtonClick.bind(this);
    this._onSaveButtonClick = this._onSaveButtonClick.bind(this);
    this._onFormKeydown = this._onFormKeydown.bind(this);
  }

  init(task) {
    this._task = task;

    this._taskComponent = new TaskCardView(task);
    this._taskEditComponent = new TaskCardEditView(task);

    this._taskComponent.setClickHandler(this._onEditButtonClick);

    render({container: this._taskContainer, child: this._taskComponent});
  }

  _replaceCardToForm() {
    replace(this._taskEditComponent, this._taskComponent);
  }

  _replaceFormToCard() {
    replace(this._taskComponent, this._taskEditComponent);

    this._taskEditComponent.removeFormSubmitHandler();
    this._taskEditComponent.removeKeydownHandler();
  }

  _onEditButtonClick() {

    this._replaceCardToForm();

    this._taskEditComponent.setFormSubmitHandler(this._onSaveButtonClick);
    this._taskEditComponent.setKeydownHandler(this._onFormKeydown);
  }

  _onSaveButtonClick() {
    this._replaceFormToCard();
  }

  _onFormKeydown() {
    this._replaceFormToCard();
  }
}
