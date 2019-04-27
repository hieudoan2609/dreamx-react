import {
  TRANSFER_SHOW,
  TRANSFER_HIDE,
  TRANSFER_AMOUNT_INPUT,
  TRANSFER_ERROR
} from "../actions/types";

const INITIAL_STATE = {
  amount: "",
  error: "",
  type: "",
  name: "",
  symbol: "",
  pending: false,
  show: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TRANSFER_ERROR:
      return { ...state, error: action.payload.error };
    case TRANSFER_AMOUNT_INPUT:
      return { ...state, amount: action.payload.amount };
    case TRANSFER_HIDE:
      return { ...state, show: false };
    case TRANSFER_SHOW:
      return {
        ...INITIAL_STATE,
        show: true,
        type: action.payload.type,
        name: action.payload.name,
        symbol: action.payload.symbol
      };
    default:
      return state;
  }
};
