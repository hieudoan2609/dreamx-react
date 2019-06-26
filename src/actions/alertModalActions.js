import {
  ALERT_MODAL_SHOW_READONLY_ALERT,
  ALERT_MODAL_HIDE,
  ALERT_MODAL_SHOW_GENERIC_ALERT
} from "../actions/types";

export const alertModalShowReadonlyAlert = () => {
  return async dispatch => {
    dispatch({ type: ALERT_MODAL_SHOW_READONLY_ALERT })
  };
}

export const alertModalShowGenericAlert = () => {
  return async dispatch => {
    dispatch({ type: ALERT_MODAL_SHOW_GENERIC_ALERT })
  };
}

export const alertModalHide = () => {
  return async dispatch => {
    dispatch({ type: ALERT_MODAL_HIDE })
  };
};
