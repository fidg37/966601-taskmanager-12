import {InsertPlace, SortType} from "../constants.js";
import {render, remove} from "../utils/render.js";
import {updateItem} from "../utils/common.js";
import BoardView from "../view/board.js";
import SortingView from "../view/sorting.js";
import NoTaskView from "../view/no-task.js";
import TaskPresenter from "./task.js";
import LoadButtonView from "../view/load-button.js";
import {getSortedTasksByDate} from "../mock/task.js";

const TASK_COUNT_PER_STEP = 8;

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._currentSortType = SortType.DEFAULT;
    this._taskPresenter = {};

    this._boardComponent = new BoardView();
    this._sortingComponent = new SortingView();
    this._noTaskComponent = new NoTaskView();
    this._loadButtonComponent = new LoadButtonView();

    this._handlers = {
      sortTypeChange: this._sortTypeChangeHandler.bind(this),
      taskChange: this._taskChangeHandler.bind(this),
      handleModeChange: this._handleModeChangeHandler.bind(this)
    };
  }

  init(boardTasks) {
    this._boardTasks = [...boardTasks];
    this._sortedBoardTasks = this._boardTasks;

    this._renderBoard();
    if (this._boardTasks.every((task) => task.isArchive)) {
      this._renderNoTasks();
      return;
    }

    this._renderTasksList(this._boardTasks);
    this._renderSorting();
  }

  _handleModeChangeHandler() {
    Object
      .values(this._taskPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _taskChangeHandler(updatedTask) {
    this._boardTasks = updateItem(this._boardTasks, updatedTask);
    this._sortedBoardTasks = updateItem(this._sortedBoardTasks, updatedTask);
    this._taskPresenter[updatedTask.id].init(updatedTask);
  }

  _renderSortedTasks(sortType) {
    if (sortType !== SortType.DEFAULT) {
      this._sortedBoardTasks = getSortedTasksByDate(this._boardTasks, sortType);
      this._renderTasksList(this._sortedBoardTasks);
    } else {
      this._renderTasksList(this._boardTasks);
    }

    this._currentSortType = sortType;
  }

  _sortTypeChangeHandler(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._clearTaskList();
    this._renderSortedTasks(sortType);
  }

  _renderSorting() {
    render({container: this._boardComponent.getElement(), child: this._sortingComponent, place: InsertPlace.AFTERBEGIN});
    this._sortingComponent.setSortTypeChangeHandler(this._handlers.sortTypeChange);
  }

  _renderTask(task) {
    const taskPresenter = new TaskPresenter(this._taskList, this._handlers.taskChange, this._handlers.handleModeChange);
    this._taskPresenter[task.id] = taskPresenter;

    taskPresenter.init(task);
  }

  _renderTasks(from, to, tasks) {
    tasks
      .slice(from, to)
      .forEach((task) => this._renderTask(task));
  }

  _renderTasksList(tasks) {
    this._renderTasks(0, TASK_COUNT_PER_STEP, tasks);
    this._renderLoadButton(tasks);
  }

  _clearTaskList() {
    Object
      .values(this._taskPresenter)
      .forEach((presenter) => presenter.destroy());

    this._taskPresenter = {};
  }

  _renderNoTasks() {
    render({container: this._boardComponent, child: this._noTaskComponent, place: InsertPlace.AFTERBEGIN});
  }

  _renderLoadButton(tasks) {
    if (tasks.length < TASK_COUNT_PER_STEP) {
      return;
    }

    const onLoadButtonClick = () => {

      const renderedTasksCount = this._taskList.querySelectorAll(`.card__form`).length;

      this._renderTasks(renderedTasksCount, renderedTasksCount + TASK_COUNT_PER_STEP, tasks);
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
  }
}
