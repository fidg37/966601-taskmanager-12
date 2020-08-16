import {IterationCount} from "./constants.js";
import {renderElement} from "./util.js";
import {renderBoard} from "./render-board-logic.js";
import SiteMenuView from "./View/site-menu.js";
import FilterView from "./View/filter.js";


import {generateTask} from "./mock/task.js";
import {generateFilter} from "./mock/filter.js";


export const tasks = new Array(IterationCount.CARD).fill().map(generateTask);
const filters = generateFilter(tasks);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

renderElement({container: siteHeaderElement, element: new SiteMenuView().getElement()});
renderElement({container: siteMainElement, element: new FilterView(filters).getElement()});

renderBoard(siteMainElement, tasks);
