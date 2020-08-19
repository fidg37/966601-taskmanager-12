import {InsertPlace} from "../constants.js";
import {render, replace, remove} from "../Utils/render.js";
import BoardView from "../View/board.js";
import SortingView from "../View/sorting.js";
import NoTaskView from "../View/no-task.js";
import TaskCardView from "../View/task-card.js";
import TaskCardEditView from "../View/task-card-edit.js";
import LoadButtonView from "../View/load-button.js";

const TASK_COUNT_PER_STEP = 8;

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;

    this._boardComponent = new BoardView();
    this._sortingComponent = new SortingView();
    this._noTaskComponent = new NoTaskView();
    this._loadButtonComponent = new LoadButtonView();
  }

  init(boardTasks) {
    this._boardTasks = [...boardTasks];

    this._renderBoard();
  }

  _renderSorting() {
    render({container: this._boardComponent.getElement(), child: this._sortingComponent, place: InsertPlace.AFTERBEGIN});
  }

  _renderTask(task) {
    const taskComponent = new TaskCardView(task);
    const taskEditComponent = new TaskCardEditView(task);

    const replaceCardToForm = () => {
      replace(taskEditComponent, taskComponent);
    };

    const replaceFormToCard = () => {
      replace(taskComponent, taskEditComponent);

      taskEditComponent.removeFormSubmitHandler();
      taskEditComponent.removeKeydownHandler();
    };

    const onEditButtonClick = () => {

      replaceCardToForm();

      taskEditComponent.setFormSubmitHandler(onSaveButtonClick);
      taskEditComponent.setKeydownHandler(onFormKeydown);
    };

    const onSaveButtonClick = () => {
      replaceFormToCard();
    };

    const onFormKeydown = () => {
      replaceFormToCard();
    };

    taskComponent.setClickHandler(onEditButtonClick);

    render({container: this._taskList, child: taskComponent});
  }

  _renderTasks(from, to) {
    this._boardTasks
      .slice(from, to)
      .forEach((task) => this._renderTask(task));
  }

  _renderNoTasks() {
    render({container: this._boardComponent, child: this._noTaskComponent, place: InsertPlace.AFTERBEGIN});
  }

  _renderLoadButton() {
    const onLoadButtonClick = () => {

      const renderedTasksCount = this._taskList.querySelectorAll(`.card__form`).length;

      this._renderTasks(renderedTasksCount, renderedTasksCount + TASK_COUNT_PER_STEP);
      if (renderedTasksCount + TASK_COUNT_PER_STEP >= this._boardTasks.length) {
        remove(this._loadButtonComponent);
        this._loadButtonComponent.removeClickHandler();
      }
    };

    if (this._boardTasks.length > TASK_COUNT_PER_STEP) {
      this._loadButtonComponent.setClickHandler(onLoadButtonClick);
      render({container: this._boardComponent, child: this._loadButtonComponent});
    }
  }

  _renderBoard() {
    this._taskList = this._boardComponent.getElement().querySelector(`.board__tasks`);

    render({container: this._boardContainer, child: this._boardComponent});

    if (this._boardTasks.every((task) => task.isArchive)) {
      this._renderNoTasks();
      return;
    }

    this._renderSorting();
    this._renderTasks(0, TASK_COUNT_PER_STEP);
    this._renderLoadButton();
  }
}
