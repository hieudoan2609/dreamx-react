import { MODAL_SHOW, MODAL_HIDE } from "../actions/types";

const INITIAL_STATE = {
  value: "",
  error: "",
  type: "",
  name: "",
  symbol: "",
  pending: false,
  show: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MODAL_HIDE:
      return { ...state, show: false };
    case MODAL_SHOW:
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
