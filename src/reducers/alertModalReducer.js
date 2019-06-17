import {
  ALERT_MODAL_SHOW_READONLY_ALERT,
  ALERT_MODAL_HIDE
} from "../actions/types";

const INITIAL_STATE = {
  type: "readonly", // alertModal.js requires a default type
  show: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ALERT_MODAL_SHOW_READONLY_ALERT:
      return { ...state, type: 'readonly', show: true }
    case ALERT_MODAL_HIDE:
      return { ...state, show: false }
    default:
      return state;
  }
};
