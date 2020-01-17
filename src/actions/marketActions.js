import { matchPath } from 'react-router'

import { MARKET_LOAD, MARKET_LOADING } from "../actions/types";
import { orderBookLoadAsync, marketTradesLoadAsync } from "."

export const marketLoadAsync = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: MARKET_LOADING
    })
    const { tickers, markets } = getState()
    const defaultTicker = tickers.all[0]

    const match = matchPath(window.location.pathname, { path: '/market/:marketSymbol' })
    const marketSymbol = match ? match.params.marketSymbol : defaultTicker.marketSymbol
    const market = markets.all.filter(m => m.symbol === marketSymbol)[0]

    const currentMarket = marketSymbol
    const baseSymbol = marketSymbol.split("_")[0]
    const quoteSymbol = marketSymbol.split("_")[1]
    const pricePrecision = market.pricePrecision
    await dispatch(orderBookLoadAsync(marketSymbol))
    await dispatch(marketTradesLoadAsync(marketSymbol))
    dispatch({
      type: MARKET_LOAD,
      payload: {
        currentMarket,
        baseSymbol,
        quoteSymbol,
        pricePrecision
      }
    });
  };
};
