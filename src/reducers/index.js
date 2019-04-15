import { combineReducers } from "redux";
import accountReducer from "./accountReducer";
import appReducer from "./appReducer";

export default combineReducers({
  account: accountReducer,
  app: appReducer
});
