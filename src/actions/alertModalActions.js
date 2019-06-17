import {
  ALERT_MODAL_SHOW_READONLY_ALERT,
  ALERT_MODAL_HIDE
} from "../actions/types";

export const alertModalShowReadonlyAlert = () => {
  return async dispatch => {
    dispatch({ type: ALERT_MODAL_SHOW_READONLY_ALERT })
  };
}

export const alertModalHide = () => {
  return async dispatch => {
    dispatch({ type: ALERT_MODAL_HIDE })
  };
};
