import {IterationCount, InsertPlace} from "./constants.js";
import {render} from "./util.js";
import {createSiteMenuTemplate} from "./View/site-menu.js";
import {createFilterTemplate} from "./View/filter.js";
import {createBoardTemplate} from "./View/board.js";
import {createSortTemplate} from "./View/sorting.js";
import {createTaskAddTemplate} from "./View/task-card-add.js";
import {createTaskCardTemplate} from "./View/task-card.js";
import {createLoadButton} from "./View/load-button.js";
import {generateTask} from "./mock/task.js";
import {generateFilter} from "./mock/filter.js";

const tasks = new Array(IterationCount.CARD).fill().map(generateTask);
const filters = generateFilter(tasks);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render({container: siteHeaderElement, template: createSiteMenuTemplate()});
render({container: siteMainElement, template: createFilterTemplate(filters)});
render({container: siteMainElement, template: createBoardTemplate()});

const boardElement = siteMainElement.querySelector(`.board`);
const taskListElement = boardElement.querySelector(`.board__tasks`);

render({container: boardElement, template: createSortTemplate(), place: InsertPlace.AFTERBEGIN});
render({container: taskListElement, template: createTaskAddTemplate(), place: InsertPlace.AFTERBEGIN});

for (let i = 0; i < Math.min(tasks.length, IterationCount.MAX_CARD_PER_STEP); i++) {
  render({container: taskListElement, template: createTaskCardTemplate(tasks[i])});
}

if (tasks.length > IterationCount.MAX_CARD_PER_STEP) {
  let renderedCardCount = IterationCount.MAX_CARD_PER_STEP;

  render({container: boardElement, template: createLoadButton()});

  const loadMoreButton = boardElement.querySelector(`.load-more`);

  loadMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    tasks
      .slice(renderedCardCount, renderedCardCount + IterationCount.MAX_CARD_PER_STEP)
      .forEach((task) => render({container: taskListElement, template: createTaskCardTemplate(task)}));

    renderedCardCount += IterationCount.MAX_CARD_PER_STEP;

    if (renderedCardCount >= tasks.length) {
      loadMoreButton.remove();
    }
  });
}
