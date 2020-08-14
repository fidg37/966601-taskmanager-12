import {renderElement} from "./util.js";
import TaskCardView from "./View/task-card.js";
import TaskCardEditView from "./View/task-card-edit.js";

export const renderTask = (taskContainer, task) => {
  const taskComponent = new TaskCardView(task).getElement();
  const taskEditComponent = new TaskCardEditView(task).getElement();
  const editButton = taskComponent.querySelector(`.card__btn--edit`);
  const editForm = taskEditComponent.querySelector(`form`);

  const replaceCardToForm = () => {
    taskContainer.replaceChild(taskEditComponent, taskComponent);
  };

  const replaceFormToCard = () => {
    taskContainer.replaceChild(taskComponent, taskEditComponent);
  };

  const editClickEvent = (evt) => {
    evt.preventDefault();

    replaceCardToForm();

    editForm.addEventListener(`submit`, saveClickEvent);
    document.addEventListener(`keydown`, EscKeydownEvent);
  };

  const saveClickEvent = (evt) => {
    evt.preventDefault();

    replaceFormToCard();
    editForm.removeEventListener(`submit`, saveClickEvent);
  };

  const EscKeydownEvent = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();

      replaceFormToCard();

      document.removeEventListener(`keydown`, EscKeydownEvent);
    }
  };

  editButton.addEventListener(`click`, editClickEvent);

  renderElement({container: taskContainer, element: taskComponent});
};
