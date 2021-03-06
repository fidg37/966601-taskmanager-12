import {isTaskRepeating, isTaskExpired, isTaskExpiredToday} from "../utils/task.js";

const taskToFilterMap = {
  all: (tasks) => tasks.filter((task) => !task.isArchive).length,
  overdue: (tasks) => tasks.filter((task) => !task.isArchive && isTaskExpired(task.dueDate)).length,
  today: (tasks) => tasks.filter((task) => !task.isArchive && isTaskExpiredToday(task.dueDate)).length,
  favorites: (tasks) => tasks.filter((task) => !task.isArchive && task.isFavorite).length,
  repeating: (tasks) => tasks.filter((task) => !task.isArchive && isTaskRepeating(task.repeating)).length,
  archive: (tasks) => tasks.filter((task) => task.isArchive).length
};

export const generateFilter = (tasks) => (
  Object.entries(taskToFilterMap).map(([filterName, filterValue]) => (
    {
      name: filterName,
      count: filterValue(tasks)
    }
  ))
);
