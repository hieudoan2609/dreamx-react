import { MARKET_CHANGE, APP_LOADING } from "../actions/types";
import { orderBookLoadAsync } from "."

export const marketUpdateCurrentMarket = newMarket => {
  return async dispatch => {
    // await dispatch(orderBookLoadAsync(newMarket))
    dispatch({
      type: MARKET_CHANGE,
      payload: {
        currentMarket: newMarket
      }
    });
  };
};
