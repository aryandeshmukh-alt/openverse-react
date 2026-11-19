export const logger = (store) => (next) => (action) => {
  if (!import.meta.env?.DEV) {
    return next(action);
  }

  console.group(action.type);
  console.log('previous state', store.getState());
  console.log('action', action);
  const result = next(action);
  console.log('next state', store.getState());
  console.groupEnd();
  return result;
};
