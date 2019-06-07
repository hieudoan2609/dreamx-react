import { ORDERS_FILTER } from "../actions/types";

export const ordersHandleSearchInput = e => {
  return (dispatch, getState) => {
    const searchValue = e.target.value;
    dispatch(filterOrders(searchValue));
  };
};

const filterOrders = (searchValue, reApply = false) => {
  return (dispatch, getState) => {
    const { orders, tokens } = getState();

    if (reApply) {
      searchValue = orders.searchValue;
    }

    const regex = new RegExp(searchValue, "gmi");
    const allOrders = orders.all;

    let filtered = [];
    for (let order of allOrders) {
      const token = tokens.all.filter(t => t.address === order.tokenAddress)[0];
      if (regex.test(token.symbol) || regex.test(token.name)) {
        filtered.push(order);
      }
    }

    dispatch({
      type: ORDERS_FILTER,
      payload: { filtered, searchValue }
    });
  };
};
