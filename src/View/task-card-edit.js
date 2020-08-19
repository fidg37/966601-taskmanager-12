import AbstractView from "./abstract.js";
import {COLORS, Keycodes} from "../constants.js";
import {humanizeDate, isTaskRepeating, isTaskExpired} from "../Utils/task.js";

export default class TaskCardEdit extends AbstractView {
  constructor(task) {
    super();

    this._task = task;
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._escKeydownHandler = this._escKeydownHandler.bind(this);
  }

  _createColorChoiseTemplate(currentColor) {
    return COLORS.map((color) =>
      `<input
      type="radio"
      id="color-${color}"
      class="card__color-input card__color-input--${color} visually-hidden"
      name="color"
      value="${color}"
      ${currentColor === color ? `checked` : ``}
      />
      <label
        for="color-${color}"
        class="card__color card__color--${color}"
        >${color}</label
      >`).join(``)
    ;
  }

  _createDateTemplate(dueDate) {
    return (`<button class="card__date-deadline-toggle" type="button">
      date: <span class="card__date-status">${dueDate !== null ? `yes` : `no`}</span>
    </button>
  
    ${dueDate !== null
        ? `<fieldset class="card__date-deadline">
            <label class="card__input-deadline-wrap">
              <input
                class="card__date"
                type="text"
                placeholder="23 September"
                name="date"
                value = "${humanizeDate(dueDate)}"
              />
            </label>
          </fieldset>`
        : ``}`);
  }

  _createRepeatTemplate(repeating) {
    return (`<button class="card__repeat-toggle" type="button">
      repeat:<span class="card__repeat-status">${isTaskRepeating(repeating) ? `yes` : `no`}</span>
    </button>
  
    ${
      isTaskRepeating(repeating) ? `<fieldset class="card__repeat-days">
        <div class="card__repeat-days-inner">
          ${Object.entries(repeating).map(([day, repeat]) => `<input
            class="visually-hidden card__repeat-day-input"
            type="checkbox"
            id="repeat-${day}-1"
            name="repeat"
            value="${day}"
            ${repeat ? `checked` : ``}
          />
          <label class="card__repeat-day" for="repeat-mo-1">
            ${day}
          </label>`).join(``)}
        </div>
      </fieldset>`
        : ``
      }`);
  }

  _createTemplate(task = {}) {
    const {
      color = `black`,
      description = ``,
      dueDate = null,
      repeating = {
        mo: false,
        tu: false,
        we: false,
        th: false,
        fr: false,
        sa: false,
        su: false
      }
    } = task;

    const deadlineClassName = isTaskExpired(dueDate)
      ? `card--deadline`
      : ``;
    const repeatingClassName = isTaskRepeating(repeating)
      ? `card--repeat`
      : ``;
    const colorsTemplate = this._createColorChoiseTemplate(color);
    const dateTemplate = this._createDateTemplate(dueDate);
    const repeatTemplate = this._createRepeatTemplate(repeating);

    return (
      `<article class="card card--edit card--${color} ${repeatingClassName} ${deadlineClassName}">
          <form class="card__form" method="get">
            <div class="card__inner">
              <div class="card__color-bar">
                <svg width="100%" height="10">
                  <use xlink:href="#wave"></use>
                </svg>
              </div>
  
              <div class="card__textarea-wrap">
                <label>
                  <textarea
                    class="card__text"
                    placeholder="Start typing your text here..."
                    name="text"
                  >${description}</textarea>
                </label>
              </div>
  
              <div class="card__settings">
                <div class="card__details">
                  <div class="card__dates">
                    ${dateTemplate}
                    ${repeatTemplate}
                  </div>
                </div>
  
                <div class="card__colors-inner">
                  <h3 class="card__colors-title">Color</h3>
                  <div class="card__colors-wrap">
                    ${colorsTemplate}
                  </div>
                </div>
              </div>
  
              <div class="card__status-btns">
                <button class="card__save" type="submit">save</button>
                <button class="card__delete" type="button">delete</button>
              </div>
            </div>
          </form>
        </article>`
    );
  }

  getTemplate() {
    return this._createTemplate(this._task);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();

    this._callback.formSubmit();
  }

  _escKeydownHandler(evt) {
    if (evt.keyCode === Keycodes.ESC) {
      evt.preventDefault();

      this._callback.keydown();
    }
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;

    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }

  setKeydownHandler(callback) {
    this._callback.keydown = callback;

    document.addEventListener(`keydown`, this._escKeydownHandler);
  }

  removeFormSubmitHandler() {
    this.getElement().querySelector(`form`).removeEventListener(`submit`, this._formSubmitHandler);
  }

  removeKeydownHandler() {
    document.removeEventListener(`keydown`, this._escKeydownHandler);
  }
}
