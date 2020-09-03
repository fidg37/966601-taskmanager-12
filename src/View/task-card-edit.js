import AbstractView from "./abstract.js";
import {COLORS, Keycodes} from "../constants.js";
import {humanizeDate, isTaskRepeating, isTaskExpired} from "../utils/task.js";
import {renderTemplate} from "../utils/render.js";
import cloneDeep from "lodash.clonedeep";

import "../../node_modules/flatpickr/dist/flatpickr.min.css";
import flatpickr from "flatpickr";

export default class TaskCardEdit extends AbstractView {
  constructor(task) {
    super();

    this._task = task;
    this._editedTask = cloneDeep(task);
    this._datepicker = null;
    this._options = {
      isDuedate: this._task.dueDate,
      isRepeating: isTaskRepeating(this._task.repeating)
    };

    this._handlers = {
      formSubmit: this._formSubmitHandler.bind(this),
      escKeydown: this._escKeydownHandler.bind(this),
      cardDetailsClick: this._cardDetailsClickHandler.bind(this),
      repeatDayClick: this._repeatDayClickHandler.bind(this),
      colorClick: this._colorClickHandler.bind(this),
      cardTextInput: this._cardTextInputHandler.bind(this),
      dueDateChange: this._dueDateChangeHandler.bind(this)
    };

    this._setDatepicker();
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
            <svg class="card__color-bar-wave" width="100%" height="10">
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

    if (this._isCardDetailsExist()) {
      this._callback.formSubmit(this._editedTask);
    }
  }

  _isCardDetailsExist() {
    return Boolean(this._editedTask.dueDate) || isTaskRepeating(this._editedTask.repeating)
      ? true
      : false
    ;
  }

  _escKeydownHandler(evt) {
    if (evt.keyCode === Keycodes.ESC) {
      evt.preventDefault();

      this._callback.keydown(this._task);
    }
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;

    this._element.querySelector(`form`).addEventListener(`submit`, this._handlers.formSubmit);
  }

  setKeydownHandler(callback) {
    this._callback.keydown = callback;

    document.addEventListener(`keydown`, this._handlers.escKeydown);
  }

  removeFormSubmitHandler() {
    this._element.querySelector(`form`).removeEventListener(`submit`, this._handlers.formSubmit);
  }

  removeKeydownHandler() {
    document.removeEventListener(`keydown`, this._handlers.escKeydown);
  }

  _isNodeNameLabel(evt) {
    return evt.target.nodeName !== `LABEL`;
  }

  _colorClickHandler(evt) {
    if (this._isNodeNameLabel(evt)) {
      return;
    }

    this._element.classList.remove(`card--${this._editedTask.color}`);
    this._element.classList.add(`card--${evt.target.control.value}`);

    this._editedTask.color = evt.target.control.value;
  }

  _repeatDayClickHandler(evt) {
    if (this._isNodeNameLabel(evt)) {
      return;
    }
    this._editedTask.dueDate = null;
    this._editedTask.repeating[evt.target.control.value] = !this._editedTask.repeating[evt.target.control.value];
  }

  _cardDetailsClickHandler(evt) {
    evt.preventDefault();

    const dateContainer = this._element.querySelector(`.card__dates`);
    dateContainer.innerHTML = ``;

    this._element.classList.toggle(`card--repeat`);

    renderTemplate({container: dateContainer, template: this._createDateTemplate(this._editedTask.dueDate, !this._options.isDuedate)});
    renderTemplate({container: dateContainer, template: this._createRepeatTemplate(this._editedTask.repeating, this._options.isDuedate)});

    if (this.getElement().querySelector(`.card__date`)) {
      this._options.isDuedate = new Date();

      this._resetRepeating();
      this._setDatepicker();
    } else {
      this._options.isDuedate = null;
    }

    this.setCardDetailsClickHandler();
  }

  _cardTextInputHandler(evt) {
    evt.preventDefault();

    this._editedTask.description = evt.target.value;
  }

  setCardTextInputHandler() {
    this._element.querySelector(`.card__text`).addEventListener(`input`, this._handlers.cardTextInput);
  }

  setCardDetailsClickHandler() {
    this._element.querySelector(`.card__repeat-toggle`).addEventListener(`click`, this._handlers.cardDetailsClick);
    this._element.querySelector(`.card__date-deadline-toggle`).addEventListener(`click`, this._handlers.cardDetailsClick);
    this.setRepeatDayClickHandler();
  }

  setRepeatDayClickHandler() {
    if (this._element.querySelector(`.card__repeat-days-inner`)) {
      this._element.querySelector(`.card__repeat-days-inner`).addEventListener(`click`, this._handlers.repeatDayClick);
    }
  }

  setColorsClickHandler() {
    this._element.querySelector(`.card__colors-wrap`).addEventListener(`click`, this._handlers.colorClick);
  }

  _dueDateChangeHandler(selectedDates) {
    this._options.isDueDate = selectedDates[0];
    this._editedTask.dueDate = this._options.isDueDate;
  }

  _resetRepeating() {
    Object.keys(this._editedTask.repeating).forEach((day) => {
      this._editedTask.repeating[day] = false;
    });
  }

  _setDatepicker() {
    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }

    if (this._options.isDuedate) {
      this._datepicker = flatpickr(
          this.getElement().querySelector(`.card__date`),
          {
            dateFormat: `j F`,
            defaultDate: this._options.isDuedate,
            onChange: this._handlers.dueDateChange
          }
      );
    }
  }
}
