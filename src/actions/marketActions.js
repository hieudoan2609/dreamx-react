import { MARKET_CHANGE } from "../actions/types";

export const marketUpdateCurrentMarket = newMarket => {
  return dispatch => {
    dispatch({
      type: MARKET_CHANGE,
      payload: {
        currentMarket: newMarket
      }
    });
  };
};
