import { MODAL_SHOW, MODAL_HIDE } from "../actions/types";

export const modalShow = () => {
  return {
    type: MODAL_SHOW
  };
};

export const modalHide = () => {
  return {
    type: MODAL_HIDE
  };
};
