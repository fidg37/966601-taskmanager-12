import AbstractView from "./abstract.js";

export default class Filter extends AbstractView {
  constructor(filters, currentFilterType) {
    super();

    this._filters = filters;
    this._currentFilterType = currentFilterType;

    this._handlers = {
      filterChange: this._filterChangeHandler.bind(this)
    };
  }

  _createElementsTemplate(filters, currentFilterType) {
    return filters.map(({name, count, type}) => (
      `<input
        type="radio"
        id="filter__${name}"
        class="filter__input visually-hidden"
        name="filter"
        ${type === currentFilterType ? `checked` : ``}
        ${count === 0 ? `disabled` : ``}
        value="${type}"
      />
      <label for="filter__${name}" class="filter__label"
        >${name}<span class="filter__${name}-count"> ${count}</span></label
      >`
    )).join(``);
  }

  _createTemplate(filters, currentFilterType) {
    return (`<section class="main__filter filter container">
      ${this._createElementsTemplate(filters, currentFilterType)}
    </section>`);
  }

  getTemplate() {
    return this._createTemplate(this._filters, this._currentFilterType);
  }

  _filterChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._handlers.filterChange);
  }
}
