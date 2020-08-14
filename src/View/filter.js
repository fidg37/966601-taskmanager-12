import {createElement} from "../util.js";

export default class Filter {
  constructor(filters) {
    this._element = null;
    this._filters = filters;
  }

  _createFilterElementsTemplate(filters) {
    return filters.map(({name, count}, filterIndex) => (
      `<input
        type="radio"
        id="filter__${name}"
        class="filter__input visually-hidden"
        name="filter"
        ${filterIndex === 0 ? `` : `disabled`}
      />
      <label for="filter__${name}" class="filter__label"
        >${name}<span class="filter__${name}-count"> ${count}</span></label
      >`
    )).join(``);
  }

  _createFilterTemplate(filters) {
    return (`<section class="main__filter filter container">
      ${this._createFilterElementsTemplate(filters)}
    </section>`);
  }

  getTemplate() {
    return this._createFilterTemplate(this._filters);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
