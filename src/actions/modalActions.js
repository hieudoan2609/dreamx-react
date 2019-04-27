import { MODAL_SHOW, MODAL_HIDE } from "../actions/types";

export const modalShow = payload => {
  return {
    type: MODAL_SHOW,
    payload
  };
};

export const modalHide = () => {
  return {
    type: MODAL_HIDE
  };
};
