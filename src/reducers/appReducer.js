import { APP_TOGGLE_THEME } from "../actions/types";

const INITIAL_STATE = {
  theme: "dark",
  loading: true
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case APP_TOGGLE_THEME:
      return { ...state, theme: action.payload.theme };
    default:
      return state;
  }
};
