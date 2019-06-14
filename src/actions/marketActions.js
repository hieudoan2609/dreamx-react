import { MARKET_LOAD, MARKET_LOADING } from "../actions/types";
import { orderBookLoadAsync } from "."

export const marketLoadAsync = newMarket => {
  return async dispatch => {

    dispatch({
      type: MARKET_LOADING
    })

    await dispatch(orderBookLoadAsync(newMarket))
    
    dispatch({
      type: MARKET_LOAD,
      payload: {
        currentMarket: newMarket
      }
    });
  };
};
