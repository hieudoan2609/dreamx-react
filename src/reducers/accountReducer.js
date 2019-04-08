import { ACCOUNT_LOGIN } from "../actions/types";

const INITIAL_STATE = {
  address: ""
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACCOUNT_LOGIN:
      return { ...state, address: action.payload.address };
    default:
      return state;
  }
};
