import {
  TRADINGVIEW_LOADING,
  TRADINGVIEW_LOADED
} from "../actions/types";

export const tradingviewLoading = () => {
  return {
    type: TRADINGVIEW_LOADING
  }
};

export const tradingviewLoaded = () => {
  return {
    type: TRADINGVIEW_LOADED
  }
};