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
    return null;
  }

  const DATE_MAX_GAP = 7;

  const dateGap = getRandomInteger(DATE_MAX_GAP, -DATE_MAX_GAP);

  const currentDate = new Date();

  currentDate.setHours(23, 59, 59, 999);

  currentDate.setDate(currentDate.getDate() + dateGap);

  const humanizeDate = currentDate.toLocaleDateString(`en`, {month: `long`, day: `numeric`});

  return humanizeDate;
};

export const generateTask = () => {
  return {
    description: generateDescription(),
    dueDate: generateDate(),
    repeating: {
      mo: false,
      tu: false,
      we: false,
      th: false,
      fr: false,
      sa: false,
      su: false
    },
    color: `black`,
    isArchive: false,
    isFavorite: false
  };
};

