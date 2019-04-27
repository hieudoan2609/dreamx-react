import {
  TRANSFER_SHOW,
  TRANSFER_HIDE,
  TRANSFER_AMOUNT_INPUT
} from "../actions/types";

export const transferShow = payload => {
  return {
    type: TRANSFER_SHOW,
    payload
  };
};

export const transferHide = () => {
  return {
    type: TRANSFER_HIDE
  };
};

export const onAmountChange = e => {
  return {
    type: TRANSFER_AMOUNT_INPUT,
    payload: {
      amount: e.target.value
    }
  };
};
