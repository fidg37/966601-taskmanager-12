import {createSiteMenuTemplate} from "./View/site-menu.js";
import {createFilterTemplate} from "./View/filter.js";
import {createBoardTemplate} from "./View/board.js";
import {createSortTemplate} from "./View/sorting.js";
import {createTaskAddTemplate} from "./View/task-card-add.js";
import {createTaskCardTemplate} from "./View/task-card.js";
import {createLoadButton} from "./View/load-button.js";

const TASK_COUNT = 5;

const InsertPlace = {
  BEFOREEND: `beforeend`,
  AFTERBEGIN: `afterbegin`
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const render = (container, template, place = InsertPlace.BEFOREEND) => {
  container.insertAdjacentHTML(place, template);
};

render(siteHeaderElement, createSiteMenuTemplate());
render(siteMainElement, createFilterTemplate());
render(siteMainElement, createBoardTemplate());

const boardElement = siteMainElement.querySelector(`.board`);
const taskListElement = boardElement.querySelector(`.board__tasks`);

render(boardElement, createSortTemplate(), InsertPlace.AFTERBEGIN);
render(taskListElement, createTaskAddTemplate(), InsertPlace.AFTERBEGIN);

for (let i = 0; i < TASK_COUNT; i++) {
  render(taskListElement, createTaskCardTemplate());
}

render(boardElement, createLoadButton());
