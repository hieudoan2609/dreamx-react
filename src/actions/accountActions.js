import { ACCOUNT_LOGIN } from "../actions/types";

export const accountLogin = address => {
  return async dispatch => {
    dispatch({
      type: ACCOUNT_LOGIN,
      payload: { address: address }
    });
  };
};
