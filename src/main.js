import {IterationCount} from "./constants.js";
import {render} from "./utils/render.js";
import BoardPresenter from "./presenter/board.js";
import SiteMenuView from "./view/site-menu.js";
import {generateTask} from "./mock/task.js";
import FilterPresenter from "./presenter/filter.js";
import TasksModel from "./model/tasks.js";
import FilterModel from "./model/filter.js";

export const tasks = new Array(IterationCount.CARD).fill().map(generateTask);

const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const filterModel = new FilterModel();

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render({container: siteHeaderElement, child: new SiteMenuView()});

const boardPresenter = new BoardPresenter(siteMainElement, tasksModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, tasksModel);

filterPresenter.init();
boardPresenter.init();

const addTaskClickHandler = (evt) => {
  evt.preventDefault();
  boardPresenter.createTask();
};

document.querySelector(`#control__new-task`).addEventListener(`click`, addTaskClickHandler);
