import {IterationCount, InsertPlace} from "./constants.js";

export const renderElement = ({container, element, place = InsertPlace.BEFOREEND}) => (
  place === InsertPlace.AFTERBEGIN
    ? container.prepend(element)
    : container.append(element)
);

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const renderTemplate = ({
  container,
  template,
  place = InsertPlace.BEFOREEND,
  iteration = IterationCount.DEFAULT
}) => {
  for (let i = 0; i < iteration; i++) {
    container.insertAdjacentHTML(place, template);
  }
};

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomBoolean = () => (
  Boolean(getRandomInteger(0, 1))
);

export const humanizeDate = (date) => (
  date.toLocaleDateString(`en`, {day: `numeric`, month: `long`})
);

export const isTaskRepeating = (repeating) => (
  Object.values(repeating).some(Boolean)
);

const getCurrentDate = () => {
  const currentDate = new Date();
  currentDate.setHours(23, 59, 59, 999);

  return new Date(currentDate);
};

export const isTaskExpired = (dueDate) => {
  if (dueDate === null) {
    return false;
  }

  const currentDate = getCurrentDate();

  return currentDate.getTime() > dueDate.getTime();
};

export const isTaskExpiredToday = (dueDate) => {
  if (dueDate === null) {
    return false;
  }

  const currentDate = getCurrentDate();

  return currentDate.getTime() === dueDate.getTime();
};
