import TaskCardEditView from "../view/task-card-edit.js";
import {remove, render} from "../utils/render.js";
import {UserAction, UpdateType, InsertPlace} from "../constants.js";
import lodashUniqueid from "lodash.uniqueid";

export default class TaskNew {
  constructor(taskListContainer, changeData) {
    this._taskListContainer = taskListContainer;
    this._changeData = changeData;

    this._taskEditComponent = null;

    this._handlers = {
      saveButtonClick: this._saveButtonClickHandler.bind(this),
      formKeydown: this._formKeydownHandler.bind(this),
      deleteClick: this._deleteClickHandler.bind(this)

    };
  }

  init() {
    if (this._taskEditComponent !== null) {
      return;
    }

    this._taskEditComponent = new TaskCardEditView();

    this._taskEditComponent.setFormSubmitHandler(this._handlers.saveButtonClick);
    this._taskEditComponent.setKeydownHandler(this._handlers.formKeydown);
    this._taskEditComponent.setDeleteClickHandler(this._handlers.deleteClick);
    this._taskEditComponent.setCardDetailsClickHandler();
    this._taskEditComponent.setColorsClickHandler();
    this._taskEditComponent.setCardTextInputHandler();

    render({container: this._taskListContainer, child: this._taskEditComponent, place: InsertPlace.AFTERBEGIN});
  }

  destroy() {
    if (this._taskEditComponent === null) {
      return;
    }

    remove(this._taskEditComponent);
    this._taskEditComponent = null;
  }

  _saveButtonClickHandler(task) {
    this._changeData(
        UserAction.ADD_TASK,
        UpdateType.MINOR,
        Object.assign({id: lodashUniqueid()}, task)
    );
    this.destroy();
  }

  _formKeydownHandler() {
    this._taskEditComponent.removeKeydownHandler();
    this._taskEditComponent.removeFormSubmitHandler();
    this.destroy();
  }

  _deleteClickHandler() {
    this._taskEditComponent.removeKeydownHandler();
    this._taskEditComponent.removeFormSubmitHandler();
    this.destroy();
  }
}
