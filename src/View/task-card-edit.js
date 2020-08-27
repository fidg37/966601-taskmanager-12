import AbstractView from "./abstract.js";
import {COLORS, Keycodes} from "../constants.js";
import {humanizeDate, isTaskRepeating, isTaskExpired} from "../utils/task.js";
import {renderTemplate} from "../utils/render.js";

export default class TaskCardEdit extends AbstractView {
  constructor(task) {
    super();

    this._task = task;
    this._editedTask = JSON.parse(JSON.stringify(this._task));
    this._options = {
      isDuedate: Boolean(this._task.dueDate),
      isRepeating: isTaskRepeating(this._task.repeating)
    };
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._escKeydownHandler = this._escKeydownHandler.bind(this);
    this._cardDetailsClickHandler = this._cardDetailsClickHandler.bind(this);
    this._repeatDayClickHandler = this._repeatDayClickHandler.bind(this);
    this._colorClickHandler = this._colorClickHandler.bind(this);
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

  _createDateTemplate(dueDate, isDueDate) {
    return (`<button class="card__date-deadline-toggle" type="button">
      date: <span class="card__date-status">${isDueDate ? `yes` : `no`}</span>
    </button>
  
    ${isDueDate
        ? `<fieldset class="card__date-deadline">
            <label class="card__input-deadline-wrap">
              <input
                class="card__date"
                type="text"
                placeholder="${dueDate ? humanizeDate(dueDate) : ``}"
                name="date"
                value = "${dueDate ? humanizeDate(dueDate) : ``}"
              />
            </label>
          </fieldset>`
        : ``}`);
  }

  _createRepeatTemplate(repeating, isRepeating) {
    return (`<button class="card__repeat-toggle" type="button">
      repeat:<span class="card__repeat-status">${isRepeating ? `yes` : `no`}</span>
    </button>
  
    ${
      isRepeating ? `<fieldset class="card__repeat-days">
        <div class="card__repeat-days-inner">
          ${Object.entries(repeating).map(([day, repeat]) => `<input
            class="visually-hidden card__repeat-day-input"
            type="checkbox"
            id="repeat-${day}-1"
            name="repeat"
            value="${day}"
            ${repeat ? `checked` : ``}
          />
          <label class="card__repeat-day" for="repeat-${day}-1">
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
    const dateTemplate = this._createDateTemplate(dueDate, this._options.isDuedate);
    const repeatTemplate = this._createRepeatTemplate(repeating, this._options.isRepeating);

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

    this._callback.formSubmit(this._editedTask);
  }

  _escKeydownHandler(evt) {
    if (evt.keyCode === Keycodes.ESC) {
      evt.preventDefault();

      this._callback.keydown(this._task);
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

  _isNodeNameLabel(evt) {
    return evt.target.nodeName !== `LABEL`;
  }

  _colorClickHandler(evt) {
    if (this._isNodeNameLabel(evt)) {
      return;
    }

    this.getElement().classList.remove(`card--${this._editedTask.color}`);
    this.getElement().classList.add(`card--${evt.target.control.value}`);

    this._editedTask.color = evt.target.control.value;
  }

  _repeatDayClickHandler(evt) {
    if (this._isNodeNameLabel(evt)) {
      return;
    }

    this._editedTask.repeating[evt.target.control.value] = !this._editedTask.repeating[evt.target.control.value];
  }

  _cardDetailsClickHandler(evt) {
    evt.preventDefault();
    const element = this.getElement();
    const dateContainer = element.querySelector(`.card__dates`);
    dateContainer.innerHTML = ``;

    element.classList.toggle(`card--repeat`);
    this._editedTask.dueDate = null;

    renderTemplate({container: dateContainer, template: this._createDateTemplate(this._task.dueDate, !this._options.isDuedate)});
    renderTemplate({container: dateContainer, template: this._createRepeatTemplate(this._task.repeating, this._options.isDuedate)});

    this._options.isDuedate = !this._options.isDuedate;

    this.setCardDetailsClickHandler();
  }

  setCardDetailsClickHandler() {
    this.getElement().querySelector(`.card__repeat-toggle`).addEventListener(`click`, this._cardDetailsClickHandler);
    this.getElement().querySelector(`.card__date-deadline-toggle`).addEventListener(`click`, this._cardDetailsClickHandler);
    this.setRepeatDayClickHandler();
  }

  setRepeatDayClickHandler() {
    if (this.getElement().querySelector(`.card__repeat-days-inner`)) {
      this.getElement().querySelector(`.card__repeat-days-inner`).addEventListener(`click`, this._repeatDayClickHandler);
    }
  }

  setColorsClickHandler() {
    this.getElement().querySelector(`.card__colors-wrap`).addEventListener(`click`, this._colorClickHandler);
  }
}
