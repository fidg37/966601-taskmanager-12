import {IterationCount} from "./constants.js";
import {renderTask} from "./render-task-logic.js";
import {renderElement} from "./util";
import LoadButtonView from "./View/load-button.js";

let handler;

const loadButtonClickEvent = (tasks, taskListContainer, button) => (evt) => {
  evt.preventDefault();

  const renderedTasksCount = taskListContainer.querySelectorAll(`.card__form`).length;

  tasks
    .slice(renderedTasksCount, renderedTasksCount + IterationCount.MAX_CARD_PER_STEP)
    .forEach((task) => renderTask(taskListContainer, task));

  if (renderedTasksCount + IterationCount.MAX_CARD_PER_STEP >= tasks.length) {
    button.removeEventListener(`click`, handler);
    button.remove();
  }
};

export const createLoadButton = (tasks, buttonContainer, taskListContainer) => {
  if (tasks.length > IterationCount.MAX_CARD_PER_STEP) {
    const button = new LoadButtonView().getElement();

    handler = loadButtonClickEvent(tasks, taskListContainer, button);

    button.addEventListener(`click`, handler);

    renderElement({container: buttonContainer, element: button});
  }
};
