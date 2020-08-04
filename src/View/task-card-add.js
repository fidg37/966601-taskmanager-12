import {COLORS} from "../constants.js";
import {humanizeDate, isTaskRepeating, isTaskExpired} from "../util.js";

const createColorChoiseTemplate = (currentColor) => (
  COLORS.map((color) => `<input
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
);

const createTaskAddDateTemplate = (dueDate) => (
  `<button class="card__date-deadline-toggle" type="button">
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
    : ``}`
);

const createTaskAddRepeatTemplate = (repeating) => (
  `<button class="card__repeat-toggle" type="button">
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
  }`
);

export const createTaskAddTemplate = (task = {}) => {
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
  const colorsTemplate = createColorChoiseTemplate(color);
  const dateTemplate = createTaskAddDateTemplate(dueDate);
  const repeatTemplate = createTaskAddRepeatTemplate(repeating);

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
};
