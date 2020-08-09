import {IterationCount} from "./constants.js";
import {render} from "./util";
import {taskListElement, tasks, boardElement} from "./main.js";
import {createTaskCardTemplate} from "./View/task-card";
import {createLoadButtonTemplate} from "./View/load-button.js";

const loadButtonClickEvent = (evt) => {
  evt.preventDefault();

  const renderedTasksCount = taskListElement.querySelectorAll(`.card__form`).length;
  if (renderedTasksCount >= tasks.length) {
    const button = boardElement.querySelector(`.load-more`);
    button.removeEventListener(`click`, loadButtonClickEvent);
    button.remove();
  } else {
    tasks
      .slice(renderedTasksCount, renderedTasksCount + IterationCount.MAX_CARD_PER_STEP)
      .forEach((task) => render({container: taskListElement, template: createTaskCardTemplate(task)}));
  }
};

export const createLoadButton = () => {
  if (tasks.length > IterationCount.MAX_CARD_PER_STEP) {
    render({container: boardElement, template: createLoadButtonTemplate()});

    const button = boardElement.querySelector(`.load-more`);

    button.addEventListener(`click`, loadButtonClickEvent);
  }
};
