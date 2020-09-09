import {InsertPlace, SortType, UserAction, UpdateType} from "../constants.js";
import {render, remove} from "../utils/render.js";
import BoardView from "../view/board.js";
import SortingView from "../view/sorting.js";
import NoTaskView from "../view/no-task.js";
import TaskPresenter from "./task.js";
import LoadButtonView from "../view/load-button.js";
import {getSortedTasksByDate} from "../mock/task.js";

const TASK_COUNT_PER_STEP = 8;

export default class Board {
  constructor(boardContainer, tasksModel) {
    this._boardContainer = boardContainer;
    this._tasksModel = tasksModel;
    this._currentSortType = SortType.DEFAULT;
    this._renderedTaskCount = TASK_COUNT_PER_STEP;
    this._taskPresenter = {};

    this._boardComponent = new BoardView();
    this._noTaskComponent = new NoTaskView();

    this._sortingComponent = null;
    this._loadButtonComponent = null;

    this._handlers = {
      sortTypeChange: this._sortTypeChangeHandler.bind(this),
      viewAction: this._viewActionHandler.bind(this),
      modeChange: this._modeChangeHandler.bind(this),
      modelEvent: this._modelEventHandler.bind(this)
    };

    this._tasksModel.addObserver(this._handlers.modelEvent);
  }

  init() {
    this._renderBoard();
  }

  _getTasks() {
    if (this._currentSortType !== SortType.DEFAULT) {
      return getSortedTasksByDate(this._tasksModel.getTasks(), this._currentSortType);
    } else {
      return this._tasksModel.getTasks();
    }
  }

  _modeChangeHandler() {
    Object
      .values(this._taskPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _viewActionHandler(userAction, updateType, updatedTask) {
    switch (userAction) {
      case UserAction.UPDATE_TASK:
        this._tasksModel.updateTask(updateType, updatedTask);
        break;
      case UserAction.ADD_TASK:
        this._tasksModel.addTask(updateType, updatedTask);
        break;
      case UserAction.DELETE_TASK:
        this._tasksModel.deleteTask(updateType, updatedTask);
        break;
    }
  }

  _modelEventHandler(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._taskPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetRenderedTaskCount: true, resetSortType: true});
        this._renderBoard();
        break;
    }
  }

  _sortTypeChangeHandler(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;

    this._clearBoard({resetRenderedTaskCount: true});
    this._renderBoard();
  }

  _renderSorting() {
    if (this._sortingComponent !== null) {
      this._sortingComponent = null;
    }

    this._sortingComponent = new SortingView(this._currentSortType);

    render({container: this._boardComponent.getElement(), child: this._sortingComponent, place: InsertPlace.AFTERBEGIN});
    this._sortingComponent.setSortTypeChangeHandler(this._handlers.sortTypeChange);
  }

  _renderTask(task) {
    const taskPresenter = new TaskPresenter(this._taskList, this._handlers.viewAction, this._handlers.modeChange);
    this._taskPresenter[task.id] = taskPresenter;

    taskPresenter.init(task);
  }

  _renderTasks(tasks) {
    tasks.forEach((task) => this._renderTask(task));
  }

  _renderNoTasks() {
    render({container: this._boardComponent, child: this._noTaskComponent, place: InsertPlace.AFTERBEGIN});
  }

  _renderLoadButton(taskCount) {
    if (this._loadButtonComponent !== null) {
      this._loadButtonComponent = null;
    }

    this._loadButtonComponent = new LoadButtonView();


    if (taskCount < TASK_COUNT_PER_STEP) {
      return;
    }

    const onLoadButtonClick = () => {
      const newRenderedTaskCount = Math.min(taskCount, this._renderedTaskCount + TASK_COUNT_PER_STEP);
      const tasks = this._getTasks().slice(this._renderedTaskCount, newRenderedTaskCount);

      this._renderTasks(tasks);
      this._renderedTaskCount = newRenderedTaskCount;

      if (this._renderedTaskCount >= taskCount) {
        remove(this._loadButtonComponent);
        this._loadButtonComponent.removeClickHandler();
      }
    };

    if (taskCount > TASK_COUNT_PER_STEP) {
      this._loadButtonComponent.setClickHandler(onLoadButtonClick);
      render({container: this._boardComponent, child: this._loadButtonComponent});
    }
  }

  _renderBoard() {
    const taskCount = this._getTasks().length;
    const tasks = this._getTasks().slice(0, Math.min(taskCount, this._renderedTaskCount));

    this._taskList = this._boardComponent.getElement().querySelector(`.board__tasks`);

    render({container: this._boardContainer, child: this._boardComponent});

    if (this._getTasks().every((task) => task.isArchive)) {
      this._renderNoTasks();
      return;
    }

    this._renderTasks(tasks);
    this._renderLoadButton(taskCount);
    this._renderSorting();
  }

  _clearBoard({resetRenderedTaskCount = false, resetSortType = false} = {}) {
    const taskCount = this._getTasks().length;

    Object
      .values(this._taskPresenter)
      .forEach((presenter) => presenter.destroy());

    this._taskPresenter = {};

    remove(this._sortingComponent);
    remove(this._noTaskComponent);
    remove(this._loadButtonComponent);

    if (resetRenderedTaskCount) {
      this._renderedTaskCount = TASK_COUNT_PER_STEP;
    } else {
      this._renderedTaskCount = Math.min(taskCount, this._renderedTaskCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }

  }
}
