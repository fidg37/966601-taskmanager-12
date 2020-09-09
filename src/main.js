import {IterationCount} from "./constants.js";
import {render} from "./utils/render.js";
import BoardPresenter from "./presenter/board.js";
import SiteMenuView from "./view/site-menu.js";
import FilterView from "./view/filter.js";
import {generateTask} from "./mock/task.js";
import {generateFilter} from "./mock/filter.js";
import TasksModel from "./model/tasks.js";

export const tasks = new Array(IterationCount.CARD).fill().map(generateTask);
const filters = generateFilter(tasks);

const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render({container: siteHeaderElement, child: new SiteMenuView()});
render({container: siteMainElement, child: new FilterView(filters)});

const presenter = new BoardPresenter(siteMainElement, tasksModel);

presenter.init(tasks);
