import {IterationCount} from "./constants.js";
import {render} from "./util";
import {createTaskCardTemplate} from "./View/task-card";
import {createLoadButtonTemplate} from "./View/load-button.js";

const loadButtonClickEvent = (tasks) => (
  (taskListContainer) => (
    (button) => (
      (evt) => {
        evt.preventDefault();

        const renderedTasksCount = taskListContainer.querySelectorAll(`.card__form`).length;
        if (renderedTasksCount >= tasks.length) {
          button.removeEventListener(`click`, loadButtonClickEvent(tasks)(taskListContainer)(button));
          button.remove();
        } else {
          tasks
        .slice(renderedTasksCount, renderedTasksCount + IterationCount.MAX_CARD_PER_STEP)
        .forEach((task) => render({container: taskListContainer, template: createTaskCardTemplate(task)}));
        }
      }
    )
  )
);

export const createLoadButton = (tasks, buttonContainer, taskListContainer) => {
  if (tasks.length > IterationCount.MAX_CARD_PER_STEP) {
    render({container: buttonContainer, template: createLoadButtonTemplate()});

    const button = buttonContainer.querySelector(`.load-more`);

    button.addEventListener(`click`, loadButtonClickEvent(tasks)(taskListContainer)(button));
  }
};
