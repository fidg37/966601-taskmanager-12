import {getRandomInteger, getRandomBoolean} from "../util.js";

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
    return ``;
  }

  const DATE_MAX_GAP = 7;

  const dateGap = getRandomInteger(DATE_MAX_GAP, -DATE_MAX_GAP);

  const currentDate = new Date();

  currentDate.setHours(23, 59, 59, 999);

  currentDate.setDate(currentDate.getDate() + dateGap);

  return currentDate;
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

const getRandomColor = () => {
  const colors = [`black`, `yellow`, `blue`, `green`, `pink`];
  const randomIndex = getRandomInteger(0, colors.length - 1);

  return colors[randomIndex];
};

export const generateTask = () => {
  const dueDate = generateDate();
  const repeating = dueDate === ``
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
    description: generateDescription(),
    dueDate,
    repeating,
    color: getRandomColor(),
    isArchive: getRandomBoolean(),
    isFavorite: getRandomBoolean()
  };
};
