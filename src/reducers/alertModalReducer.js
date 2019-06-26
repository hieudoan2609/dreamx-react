import {
  ALERT_MODAL_SHOW_READONLY_ALERT,
  ALERT_MODAL_HIDE,
  ALERT_MODAL_SHOW_GENERIC_ALERT
} from "../actions/types";

const INITIAL_STATE = {
  type: "readonly", // alertModal.js requires a default type
  show: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ALERT_MODAL_SHOW_GENERIC_ALERT:
      return { ...state, type: 'generic', show: true }
    case ALERT_MODAL_SHOW_READONLY_ALERT:
      return { ...state, type: 'readonly', show: true }
    case ALERT_MODAL_HIDE:
      return { ...state, show: false }
    default:
      return state;
  }
};
