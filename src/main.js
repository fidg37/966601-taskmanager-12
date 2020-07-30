import {createSiteMenuTemplate} from "./View/site-menu.js";
import {createFilterTemplate} from "./View/filter.js";
import {createBoardTemplate} from "./View/board.js";
import {createSortTemplate} from "./View/sorting.js";
import {createTaskAddTemplate} from "./View/task-card-add.js";
import {createTaskCardTemplate} from "./View/task-card.js";
import {createLoadButton} from "./View/load-button.js";

const IterationCount = {
  DEFAULT: 1,
  CARD: 5
};

const InsertPlace = {
  BEFOREEND: `beforeend`,
  AFTERBEGIN: `afterbegin`
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const render = ({
  container,
  template,
  place = InsertPlace.BEFOREEND,
  iteration = IterationCount.DEFAULT
}) => {
  for (let i = 0; i < iteration; i++) {
    container.insertAdjacentHTML(place, template);
  }
};

render({container: siteHeaderElement, template: createSiteMenuTemplate()});
render({container: siteMainElement, template: createFilterTemplate()});
render({container: siteMainElement, template: createBoardTemplate()});

const boardElement = siteMainElement.querySelector(`.board`);
const taskListElement = boardElement.querySelector(`.board__tasks`);

render({container: boardElement, template: createSortTemplate(), place: InsertPlace.AFTERBEGIN});
render({container: taskListElement, template: createTaskAddTemplate(), place: InsertPlace.AFTERBEGIN});
render({container: taskListElement, template: createTaskCardTemplate(), iteration: IterationCount.CARD});
render({container: boardElement, template: createLoadButton()});
