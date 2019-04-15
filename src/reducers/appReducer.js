import { APP_TOGGLE_THEME, APP_INITIALIZE } from "../actions/types";

const INITIAL_STATE = {
  theme: "dark",
  loading: true
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case APP_INITIALIZE:
      return { ...state, loading: false };
    case APP_TOGGLE_THEME:
      return { ...state, theme: action.payload.theme };
    default:
      return state;
  }
};
