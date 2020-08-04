import {getRandomInteger} from "../util.js";

const generateDescription = () => {
  const descriptions = [
    `Изучить теорию`,
    `Сделать домашку`,
    `Пройти интенсив на соточку`
  ];

  const randomIndex = getRandomInteger(0, descriptions.length - 1);

  return descriptions[randomIndex];
};

export const generateTask = () => {
  return {
    description: generateDescription(),
    dueDate: null,
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
