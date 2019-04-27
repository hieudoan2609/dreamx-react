import {
  TRANSFER_SHOW,
  TRANSFER_HIDE,
  TRANSFER_AMOUNT_INPUT,
  TRANSFER_ERROR
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

export const transferHandleAmountChange = e => {
  return {
    type: TRANSFER_AMOUNT_INPUT,
    payload: {
      amount: e.target.value
    }
  };
};

export const transferHandleSubmitAsync = () => {
  return (dispatch, getState) => {
    const { transfer } = getState();

    if (transfer.amount === "" || parseFloat(transfer.amount) === 0) {
      dispatch({
        type: TRANSFER_ERROR,
        payload: {
          error: "Amount can't be empty."
        }
      });

      return;
    }

    console.log("SUBMIT");
  };
};
