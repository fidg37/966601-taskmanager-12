import AbstractView from "./abstract.js";
import {humanizeDate, isTaskRepeating, isTaskExpired} from "../utils/task.js";

export default class TaskCard extends AbstractView {
  constructor(task) {
    super();

    this._task = task;
    this._clickHandler = this._clickHandler.bind(this);
  }

  _createTemplate({color, dueDate, description, repeating, isArchive, isFavorite}) {
    const repeatClassName = isTaskRepeating(repeating)
      ? `card--repeat`
      : ``;

    const archiveClassName = isArchive
      ? `card__btn--archive card__btn--disabled`
      : `card__btn--archive`;

    const favoriteClassName = isFavorite
      ? `card__btn--favorites card__btn--disabled`
      : `card__btn--favorites`;

    const deadlineClassName = isTaskExpired(dueDate)
      ? `card--deadline`
      : ``;

    const date = dueDate !== null ? humanizeDate(dueDate) : ``;

    return (
      `<article class="card card--${color} ${deadlineClassName} ${repeatClassName}">
        <div class="card__form">
          <div class="card__inner">
            <div class="card__control">
              <button type="button" class="card__btn card__btn--edit">
                edit
              </button>
              <button type="button" class="card__btn ${archiveClassName}">
                archive
              </button>
              <button
                type="button"
                class="card__btn ${favoriteClassName}"
              >
                favorites
              </button>
            </div>
  
            <div class="card__color-bar">
              <svg class="card__color-bar-wave" width="100%" height="10">
                <use xlink:href="#wave"></use>
              </svg>
            </div>
  
            <div class="card__textarea-wrap">
              <p class="card__text">${description}</p>
            </div>
  
            <div class="card__settings">
              <div class="card__details">
                <div class="card__dates">
                  <div class="card__date-deadline">
                    <p class="card__input-deadline-wrap">
                      <span class="card__date">${date}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>`
    );
  }

  getTemplate() {
    return this._createTemplate(this._task);
  }

  _clickHandler(evt) {
    evt.preventDefault();

    this._callback.click();
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector(`.card__btn--edit`).addEventListener(`click`, this._clickHandler);
  }
}
