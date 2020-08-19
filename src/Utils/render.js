import Abstract from "../view/abstract.js";
import {IterationCount, InsertPlace} from "../constants.js";

export const render = ({container, child, place = InsertPlace.BEFOREEND}) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }

  if (child instanceof Abstract) {
    child = child.getElement();
  }

  if (place === InsertPlace.AFTERBEGIN) {
    container.prepend(child);
  } else {
    container.append(child);
  }
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

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const replace = (newChild, oldChild) => {
  if (oldChild instanceof Abstract) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof Abstract) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;
  if (parent === null || oldChild === null || newChild === null) {
    throw new Error(`Can't replace unexisting elements`);
  }

  parent.replaceChild(newChild, oldChild);
};

export const remove = (component) => {
  if (!(component instanceof Abstract)) {
    throw new Error(`Can remove only components`);
  }

  component.getElement().remove();
  component.removeElement();
};
