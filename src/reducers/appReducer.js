import {
  APP_TOGGLE_THEME,
  APP_INITIALIZE,
  APP_LOADING,
  APP_LOADED,
  APP_OFFLINE
} from "../actions/types";

const INITIAL_STATE = {
  theme: "dark",
  loading: true,
  contractAddress: "",
  networkId: 0,
  networkName: "",
  makerFee: "",
  makerMinimum: "",
  takerFee: "",
  takerMinimum: ""
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
        networkName: action.payload.networkName,
        makerFee: action.payload.makerFee,
        makerMinimum: action.payload.makerMinimum,
        takerFee: action.payload.takerFee,
        takerMinimum: action.payload.takerMinimum
      };
    case APP_OFFLINE:
      return { ...state, offline: true };
    case APP_TOGGLE_THEME:
      return { ...state, theme: action.payload.theme };
    default:
      return state;
  }
};
