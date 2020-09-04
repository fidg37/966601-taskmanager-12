import TaskCardView from "../view/task-card.js";
import TaskCardEditView from "../view/task-card-edit.js";
import {render, replace, remove} from "../utils/render.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class Task {
  constructor(taskContainer, changeData, changeMode) {
    this._taskContainer = taskContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._taskComponent = null;
    this._taskEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._handlers = {
      editButtonClick: this._editButtonClickHandler.bind(this),
      saveButtonClick: this._saveButtonClickHandler.bind(this),
      formKeydown: this._formKeydownHandler.bind(this),
      favoriteClick: this._favoriteClickHandler.bind(this),
      archiveClick: this._archiveClickHandler.bind(this)
    };
  }

  init(task) {
    this._task = task;

    this._savePrevTaskComponents();

    this._taskComponent = new TaskCardView(task);
    this._taskEditComponent = new TaskCardEditView(task);

    this._setTaskHandlers();

    if (this._isFirstInit()) {
      render({container: this._taskContainer, child: this._taskComponent});
    } else {
      this._replaceComponents();
    }
  }

  _isFirstInit() {
    return this._prevTaskComponent === null || this._prevTaskEditComponent === null;
  }

  _savePrevTaskComponents() {
    this._prevTaskComponent = this._taskComponent;
    this._prevTaskEditComponent = this._taskEditComponent;
  }

  _removePrevTaskComponents() {
    remove(this._prevTaskComponent);
    remove(this._prevTaskEditComponent);
  }

  _setTaskHandlers() {
    this._taskComponent.setEditClickHandler(this._handlers.editButtonClick);
    this._taskComponent.setFavoriteClickHandler(this._handlers.favoriteClick);
    this._taskComponent.setArchiveClickHandler(this._handlers.archiveClick);
  }

  _replaceComponents() {
    if (this._mode === Mode.DEFAULT) {
      replace(this._taskComponent, this._prevTaskComponent);
    } else {
      replace(this._taskComponent, this._prevTaskEditComponent);
    }

    this._removePrevTaskComponents();
  }

  destroy() {
    remove(this._taskComponent);
    remove(this._taskEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToCard();
    }
  }

  _replaceCardToForm() {
    replace(this._taskEditComponent, this._taskComponent);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToCard() {
    replace(this._taskComponent, this._taskEditComponent);

    this._taskEditComponent.removeFormSubmitHandler();
    this._taskEditComponent.removeKeydownHandler();
    this._mode = Mode.DEFAULT;
  }

  _editButtonClickHandler() {

    this._replaceCardToForm();

    this._taskEditComponent.setFormSubmitHandler(this._handlers.saveButtonClick);
    this._taskEditComponent.setKeydownHandler(this._handlers.formKeydown);
    this._taskEditComponent.setCardDetailsClickHandler();
    this._taskEditComponent.setColorsClickHandler();
    this._taskEditComponent.setCardTextInputHandler();
  }

  _saveButtonClickHandler(task) {
    this._replaceFormToCard();
    this._changeData(task);
  }

  _formKeydownHandler(task) {
    this._replaceFormToCard();
    this._changeData(task);
  }

  _favoriteClickHandler(task) {
    this._changeData(Object.assign({}, task, {
      isFavorite: !this._task.isFavorite
    }));
  }

  _archiveClickHandler(task) {
    this._changeData(Object.assign({}, task, {
      isArchive: !this._task.isArchive
    }));
  }
}
