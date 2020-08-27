import TaskCardView from "../view/task-card.js";
import TaskCardEditView from "../view/task-card-edit.js";
import {render, replace, remove} from "../utils/render.js";

export default class Task {
  constructor(taskContainer, changeData) {
    this._taskContainer = taskContainer;
    this._changeData = changeData;

    this._taskComponent = null;
    this._taskEditComponent = null;

    this._onEditButtonClick = this._onEditButtonClick.bind(this);
    this._onSaveButtonClick = this._onSaveButtonClick.bind(this);
    this._onFormKeydown = this._onFormKeydown.bind(this);
    this._onFavoriteClick = this._onFavoriteClick.bind(this);
    this._onArchiveClick = this._onArchiveClick.bind(this);
  }

  init(task) {
    this._task = task;

    const prevTaskComponent = this._taskComponent;
    const prevTaskEditComponent = this._taskEditComponent;

    this._taskComponent = new TaskCardView(task);
    this._taskEditComponent = new TaskCardEditView(task);

    this._taskComponent.setEditClickHandler(this._onEditButtonClick);
    this._taskComponent.setFavoriteClickHandler(this._onFavoriteClick);
    this._taskComponent.setArchiveClickHandler(this._onArchiveClick);

    if (prevTaskComponent === null || prevTaskEditComponent === null) {
      render({container: this._taskContainer, child: this._taskComponent});
      return;
    }

    if (this._taskContainer.contains(prevTaskComponent.getElement())) {
      replace(this._taskComponent, prevTaskComponent);
    }

    if (this._taskContainer.contains(prevTaskEditComponent.getElement())) {
      replace(this._taskComponent, prevTaskEditComponent);
    }

    remove(prevTaskComponent);
    remove(prevTaskEditComponent);
  }

  destroy() {
    remove(this._taskComponent);
    remove(this._taskEditComponent);
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
    this._taskEditComponent.setCardDetailsClickHandler();
    this._taskEditComponent.setColorsClickHandler();
  }

  _onSaveButtonClick(task) {
    this._replaceFormToCard();
    this._changeData(task);
  }

  _onFormKeydown(task) {
    this._replaceFormToCard();
    this._changeData(task);
  }

  _onFavoriteClick(task) {
    this._changeData(Object.assign({}, task, {
      isFavorite: !this._task.isFavorite
    }));
  }

  _onArchiveClick(task) {
    this._changeData(Object.assign({}, task, {
      isArchive: !this._task.isArchive
    }));
  }
}
