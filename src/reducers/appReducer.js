import {
  APP_TOGGLE_THEME,
  APP_INITIALIZE,
  APP_LOADING,
  APP_LOADED
} from "../actions/types";

const INITIAL_STATE = {
  theme: "dark",
  loading: true,
  contractAddress: "",
  networkId: 0,
  networkName: ""
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case APP_LOADED:
      return { ...state, loading: false };
    case APP_LOADING:
      return { ...state, loading: true };
    case APP_INITIALIZE:
      return {
        ...state,
        contractAddress: action.payload.contractAddress,
        networkId: action.payload.networkId,
        networkName: action.payload.networkName
      };
    case APP_TOGGLE_THEME:
      return { ...state, theme: action.payload.theme };
    default:
      return state;
  }
};
