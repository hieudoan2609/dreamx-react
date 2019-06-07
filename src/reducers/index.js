import { combineReducers } from "redux";

import accountReducer from "./accountReducer";
import appReducer from "./appReducer";
import tokensReducer from "./tokensReducer";
import transferReducer from "./transferReducer";
import transfersReducer from "./transfersReducer";
import ordersReducer from "./ordersReducer";
import { RESET_INITIAL_STATE } from "../actions/types";

const indexReducer = combineReducers({
  account: accountReducer,
  app: appReducer,
  tokens: tokensReducer,
  transfer: transferReducer,
  transfers: transfersReducer,
  orders: ordersReducer
});

const rootReducer = (state, action) => {
  if (action.type === RESET_INITIAL_STATE) {
    state = undefined;
  }

  return indexReducer(state, action);
};

export default rootReducer;
