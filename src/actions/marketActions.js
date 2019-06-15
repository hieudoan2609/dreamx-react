import { matchPath } from 'react-router'

import { MARKET_LOAD, MARKET_LOADING } from "../actions/types";
import { orderBookLoadAsync } from "."

export const marketLoadAsync = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: MARKET_LOADING
    })
    const { tickers, markets } = getState()
    const defaultTicker = tickers.all[0]
    const match = matchPath(window.location.pathname, { path: '/market/:marketSymbol' })
    const marketSymbol = match ? match.params.marketSymbol : undefined
    const marketSymbolExists = markets.all.filter(m => m.symbol === marketSymbol)[0] ? true : false
    const currentMarket = marketSymbolExists ? marketSymbol : defaultTicker.marketSymbol
    const baseSymbol = currentMarket.split("_")[0] || ""
    const quoteSymbol = currentMarket.split("_")[1] || ""
    await dispatch(orderBookLoadAsync(currentMarket))
    dispatch({
      type: MARKET_LOAD,
      payload: {
        currentMarket,
        baseSymbol,
        quoteSymbol
      }
    });
  };
};
