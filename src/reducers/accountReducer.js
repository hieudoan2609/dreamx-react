import {
  ACCOUNT_LOGIN,
  ACCOUNT_LOGOUT,
  ACCOUNT_METAMASK_UNAVAILABLE,
  ACCOUNT_METAMASK_WRONGNETWORK,
  ACCOUNT_LOADING,
  ACCOUNT_LOADED,
  ACCOUNT_METAMASK_NOTREADY
} from "../actions/types";

const INITIAL_STATE = {
  address: "",
  metamask: "running",
  loading: true
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACCOUNT_METAMASK_NOTREADY:
      return { ...state, metamask: "notready", loading: false };
    case ACCOUNT_LOADING:
      return { ...state, loading: true };
    case ACCOUNT_LOADED:
      return { ...state, loading: false };
    case ACCOUNT_METAMASK_WRONGNETWORK:
      return { ...state, metamask: "wrongnetwork", loading: false };
    case ACCOUNT_METAMASK_UNAVAILABLE:
      return { ...state, metamask: "unavailable", loading: false };
    case ACCOUNT_LOGIN:
      return {
        ...state,
        address: action.payload.address,
        metamask: "running",
        loading: false
      };
    case ACCOUNT_LOGOUT:
      return { ...state, address: "", loading: false };
    default:
      return state;
  }
};
