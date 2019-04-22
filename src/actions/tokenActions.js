import { TOKEN_FILTER } from "../actions/types";

export const tokenFilter = searchValue => {
  return async (dispatch, getState) => {
    const regex = new RegExp(searchValue, "gmi");
    const state = getState();
    const allTokens = state.tokens.all;

    let filtered = [];
    for (let token of allTokens) {
      if (regex.test(token.symbol) || regex.test(token.name)) {
        filtered.push(token);
      }
    }

    dispatch({
      type: TOKEN_FILTER,
      payload: { filtered, searchValue }
    });
  };
};
