import { MODAL_SHOW, MODAL_HIDE } from "../actions/types";

const INITIAL_STATE = {
  show: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MODAL_HIDE:
      return { ...state, show: false };
    case MODAL_SHOW:
      return { ...state, show: true };
    default:
      return state;
  }
};
