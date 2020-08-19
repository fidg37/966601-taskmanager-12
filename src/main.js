import {IterationCount} from "./constants.js";
import {render} from "./util.js";
import BoardPresenter from "./presenter/board.js";
import SiteMenuView from "./View/site-menu.js";
import FilterView from "./View/filter.js";


import {generateTask} from "./mock/task.js";
import {generateFilter} from "./mock/filter.js";


export const tasks = new Array(IterationCount.CARD).fill().map(generateTask);
const filters = generateFilter(tasks);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render({container: siteHeaderElement, child: new SiteMenuView()});
render({container: siteMainElement, child: new FilterView(filters)});

const presenter = new BoardPresenter(siteMainElement);

presenter.init(tasks);
