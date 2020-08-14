import {IterationCount, InsertPlace} from "./constants.js";
import {renderElement} from "./util.js";
import SiteMenuView from "./View/site-menu.js";
import FilterView from "./View/filter.js";
import BoardView from "./View/board.js";
import SortingView from "./View/sorting.js";
import {renderTask} from "./render-task-logic.js";
import {generateTask} from "./mock/task.js";
import {generateFilter} from "./mock/filter.js";
import {createLoadButton} from "./loadButtonLogic.js";

export const tasks = new Array(IterationCount.CARD).fill().map(generateTask);
const filters = generateFilter(tasks);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

renderElement({container: siteHeaderElement, element: new SiteMenuView().getElement()});
renderElement({container: siteMainElement, element: new FilterView(filters).getElement()});
renderElement({container: siteMainElement, element: new BoardView().getElement()});

export const boardElement = siteMainElement.querySelector(`.board`);
export const taskListElement = boardElement.querySelector(`.board__tasks`);

renderElement({container: boardElement, element: new SortingView().getElement(), place: InsertPlace.AFTERBEGIN});

for (let i = 0; i < Math.min(tasks.length, IterationCount.MAX_CARD_PER_STEP); i++) {
  renderTask(taskListElement, tasks[i]);
}

createLoadButton(tasks, boardElement, taskListElement);
