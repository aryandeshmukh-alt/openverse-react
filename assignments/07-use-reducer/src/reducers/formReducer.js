export function formReducer(state, action) {
  switch (action.type) {
    case 'CHANGE_FIELD':
      return { ...state, [action.name]: action.value };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}
