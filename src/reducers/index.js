import { combineReducers } from "redux";

import accountReducer from "./accountReducer";
import appReducer from "./appReducer";
import tokensReducer from "./tokensReducer";
import transferReducer from "./transferReducer";
import transfersReducer from "./transfersReducer";
import accountOrdersReducer from "./accountOrdersReducer";
import accountTradesReducer from "./accountTradesReducer";
import marketsReducer from "./marketsReducer";
import tickersReducer from "./tickersReducer";
import marketReducer from "./marketReducer";
import { RESET_INITIAL_STATE } from "../actions/types";

const indexReducer = combineReducers({
  account: accountReducer,
  app: appReducer,
  tokens: tokensReducer,
  transfer: transferReducer,
  transfers: transfersReducer,
  accountOrders: accountOrdersReducer,
  markets: marketsReducer,
  accountTrades: accountTradesReducer,
  tickers: tickersReducer,
  market: marketReducer
});

const rootReducer = (state, action) => {
  if (action.type === RESET_INITIAL_STATE) {
    state = undefined;
  }

  return indexReducer(state, action);
};

export default rootReducer;
