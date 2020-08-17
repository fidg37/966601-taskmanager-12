import {InsertPlace, IterationCount} from "./constants.js";
import {renderElement} from "./util.js";
import BoardView from "./View/board.js";
import SortingView from "./View/sorting.js";
import NoTaskView from "./View/no-task.js";
import {renderTask} from "./render-task-logic.js";
import {createLoadButton} from "./loadButtonLogic.js";

export const renderBoard = (boardContainer, boardTasks) => {
  const boardComponent = new BoardView().getElement();
  const taskList = boardComponent.querySelector(`.board__tasks`);

  renderElement({container: boardContainer, element: boardComponent});

  if (boardTasks.every((task) => task.isArchive)) {
    renderElement({container: boardComponent, element: new NoTaskView().getElement(), place: InsertPlace.AFTERBEGIN});
    return;
  }

  renderElement({container: boardComponent, element: new SortingView().getElement(), place: InsertPlace.AFTERBEGIN});

  for (let i = 0; i < Math.min(boardTasks.length, IterationCount.MAX_CARD_PER_STEP); i++) {
    renderTask(taskList, boardTasks[i]);
  }

  createLoadButton(boardTasks, boardComponent, taskList);
};
