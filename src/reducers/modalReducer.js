import { MODAL_TOGGLE } from "../actions/types";

const INITIAL_STATE = {
  show: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MODAL_TOGGLE:
      return { ...state, show: !state.show };
    default:
      return state;
  }
};
