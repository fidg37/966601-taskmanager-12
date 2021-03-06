import moment from "moment";

export const formatDate = (date) => {
  if (!(date instanceof Date)) {
    return ``;
  }

  return moment(date).format(`D MMMM`);
};

export const isTaskRepeating = (repeating) => (
  Object.values(repeating).some(Boolean)
);

const getCurrentDate = () => {
  const currentDate = new Date();
  currentDate.setHours(23, 59, 59, 999);

  return new Date(currentDate);
};

export const isTaskExpired = (dueDate) => {
  if (dueDate === null) {
    return false;
  }

  const currentDate = getCurrentDate();

  return currentDate.getTime() > new Date(dueDate).getTime();
};

export const isTaskExpiredToday = (dueDate) => {
  if (dueDate === null) {
    return false;
  }

  const currentDate = getCurrentDate();

  return currentDate.getTime() === dueDate.getTime();
};
