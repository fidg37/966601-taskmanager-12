const createFilterElementsTemplate = (filters) => (
  [...filters].map((filter, filterIndex) => {
    const {name, count} = filter;

    return (
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
    );
  }).join(``)
);

export const createFilterTemplate = (filters) => {
  const filtersItemTemplate = createFilterElementsTemplate(filters);

  return (`<section class="main__filter filter container">
    ${filtersItemTemplate}
  </section>`);
};
