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
  constructor(boardContainer, tasksModel) {
    this._boardContainer = boardContainer;
    this._tasksModel = tasksModel;
    this._currentSortType = SortType.DEFAULT;
    this._renderedTaskCount = TASK_COUNT_PER_STEP;
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

  _sortTypeChangeHandler(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;

    this._clearTaskList();
    this._renderTasksList();
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

  _renderTasks(tasks) {
    tasks.forEach((task) => this._renderTask(task));
  }

  _renderTasksList() {
    const taskCount = this._getTasks().length;
    const tasks = this._getTasks().slice(0, Math.min(taskCount, TASK_COUNT_PER_STEP));

    this._renderTasks(tasks);
    this._renderLoadButton(taskCount);
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

  _renderLoadButton(taskCount) {
    if (taskCount < TASK_COUNT_PER_STEP) {
      return;
    }

    this._renderedTaskCount = TASK_COUNT_PER_STEP;

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
    this._taskList = this._boardComponent.getElement().querySelector(`.board__tasks`);

    render({container: this._boardContainer, child: this._boardComponent});

    if (this._getTasks().every((task) => task.isArchive)) {
      this._renderNoTasks();
      return;
    }

    this._renderTasksList();
    this._renderSorting();
  }
}
