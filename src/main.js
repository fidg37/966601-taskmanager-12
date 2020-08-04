import {createSiteMenuTemplate} from "./View/site-menu.js";
import {createFilterTemplate} from "./View/filter.js";
import {createBoardTemplate} from "./View/board.js";
import {createSortTemplate} from "./View/sorting.js";
import {createTaskAddTemplate} from "./View/task-card-add.js";
import {createTaskCardTemplate} from "./View/task-card.js";
import {createLoadButton} from "./View/load-button.js";
import {IterationCount, InsertPlace, render} from "./util.js";
import {generateTask} from "./mock/task.js";

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render({container: siteHeaderElement, template: createSiteMenuTemplate()});
render({container: siteMainElement, template: createFilterTemplate()});
render({container: siteMainElement, template: createBoardTemplate()});

const boardElement = siteMainElement.querySelector(`.board`);
const taskListElement = boardElement.querySelector(`.board__tasks`);

render({container: boardElement, template: createSortTemplate(), place: InsertPlace.AFTERBEGIN});
render({container: taskListElement, template: createTaskAddTemplate(), place: InsertPlace.AFTERBEGIN});
render({container: taskListElement, template: createTaskCardTemplate(), iteration: IterationCount.CARD});
render({container: boardElement, template: createLoadButton()});
