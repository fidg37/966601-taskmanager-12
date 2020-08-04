const IterationCount = {
  DEFAULT: 1,
  CARD: 5
};

const InsertPlace = {
  BEFOREEND: `beforeend`,
  AFTERBEGIN: `afterbegin`
};

const render = ({
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

export {IterationCount, InsertPlace, render};
