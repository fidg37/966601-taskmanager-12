import {COLORS, SortType} from "../constants.js";
import {getRandomInteger, getRandomBoolean} from "../utils/common.js";

const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

const generateDescription = () => {
  const descriptions = [
    `Изучить теорию`,
    `Сделать домашку`,
    `Пройти интенсив на соточку`
  ];

  const randomIndex = getRandomInteger(0, descriptions.length - 1);

  return descriptions[randomIndex];
};

const generateDate = () => {
  const isDate = getRandomBoolean();

  if (!isDate) {
    return null;
  }

  const DATE_MAX_GAP = 7;

  const dateGap = getRandomInteger(DATE_MAX_GAP, -DATE_MAX_GAP);

  const currentDate = new Date();

  currentDate.setHours(23, 59, 59, 999);

  currentDate.setDate(currentDate.getDate() + dateGap);

  return new Date(currentDate);
};

const generateRepeating = () => (
  {
    mo: false,
    tu: false,
    we: getRandomBoolean(),
    th: false,
    fr: getRandomBoolean(),
    sa: false,
    su: false
  }
);

const getRandomColor = (colors) => {
  const randomIndex = getRandomInteger(0, colors.length - 1);

  return colors[randomIndex];
};

export const generateTask = () => {
  const dueDate = generateDate();
  const repeating = dueDate === null
    ? generateRepeating()
    : {
      mo: false,
      tu: false,
      we: false,
      th: false,
      fr: false,
      sa: false,
      su: false
    };

  return {
    id: generateId(),
    description: generateDescription(),
    dueDate,
    repeating,
    color: getRandomColor(COLORS),
    isArchive: getRandomBoolean(),
    isFavorite: getRandomBoolean()
  };
};

const sortTaskUp = (taskA, taskB) => (
  taskA.dueDate.getTime() - taskB.dueDate.getTime()
);

const sortTaskDown = (taskA, taskB) => (
  taskB.dueDate.getTime() - taskA.dueDate.getTime()
);

export const getSortedTasksByDate = (tasks, sortType) => {
  const {tasksWithDueDate, tasksWithoutDueDate} = tasks.reduce((acc, task) => {
    if (task.dueDate) {
      acc.tasksWithDueDate.push(task);
    } else {
      acc.tasksWithoutDueDate.push(task);
    }

    return acc;
  }, {tasksWithDueDate: [], tasksWithoutDueDate: []});

  const sortedTasks = (sortType === SortType.DATE_DOWN
    ? tasksWithDueDate.sort(sortTaskDown)
    : tasksWithDueDate.sort(sortTaskUp)
  ).concat(tasksWithoutDueDate);

  return sortedTasks;
};
