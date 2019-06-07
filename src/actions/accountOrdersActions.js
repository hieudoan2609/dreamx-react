// import axios from "axios";

import {
  ACCOUNT_ORDERS_FILTER,
  ACCOUNT_ORDERS_LOAD,
  ACCOUNT_ORDERS_CLEAR_FILTER
} from "../actions/types";
// import config from "../config";
// import { convertKeysToCamelCase } from "../helpers";
import singletons from "../singletons";

const accountOrdersData = [
  {
    accountAddress: "0x8a37b79E54D69e833d79Cac3647C877Ef72830E1",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    filled: "0",
    status: "open",
    nonce: "1551036154000",
    expiryTimestampInMilliseconds: "1506550595000",
    hash: "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    createdAt: "2019-06-07T15:15:44.498Z"
  },
  {
    accountAddress: "0x8a37b79E54D69e833d79Cac3647C877Ef72830E1",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    filled: "0",
    status: "open",
    nonce: "1551036154000",
    expiryTimestampInMilliseconds: "1506550595000",
    hash: "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    createdAt: "2019-06-07T15:15:44.498Z"
  },
  {
    accountAddress: "0x8a37b79E54D69e833d79Cac3647C877Ef72830E1",
    giveTokenAddress: "0x0000000000000000000000000000000000000000",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    takeAmount: "20000000000000000",
    filled: "0",
    status: "open",
    nonce: "1551036154000",
    expiryTimestampInMilliseconds: "1506550595000",
    hash: "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    createdAt: "2019-06-07T15:15:44.498Z"
  },
  {
    accountAddress: "0x8a37b79E54D69e833d79Cac3647C877Ef72830E1",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    filled: "0",
    status: "open",
    nonce: "1551036154000",
    expiryTimestampInMilliseconds: "1506550595000",
    hash: "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    createdAt: "2019-06-07T15:15:44.498Z"
  },
  {
    accountAddress: "0x8a37b79E54D69e833d79Cac3647C877Ef72830E1",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    filled: "0",
    status: "open",
    nonce: "1551036154000",
    expiryTimestampInMilliseconds: "1506550595000",
    hash: "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    createdAt: "2019-06-07T15:15:44.498Z"
  },
  {
    accountAddress: "0x8a37b79E54D69e833d79Cac3647C877Ef72830E1",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    filled: "0",
    status: "open",
    nonce: "1551036154000",
    expiryTimestampInMilliseconds: "1506550595000",
    hash: "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    createdAt: "2019-06-07T15:15:44.498Z"
  },
  {
    accountAddress: "0x8a37b79E54D69e833d79Cac3647C877Ef72830E1",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    filled: "0",
    status: "open",
    nonce: "1551036154000",
    expiryTimestampInMilliseconds: "1506550595000",
    hash: "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    createdAt: "2019-06-07T15:15:44.498Z"
  },
  {
    accountAddress: "0x8a37b79E54D69e833d79Cac3647C877Ef72830E1",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    filled: "0",
    status: "open",
    nonce: "1551036154000",
    expiryTimestampInMilliseconds: "1506550595000",
    hash: "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    createdAt: "2019-06-07T15:15:44.498Z"
  },
  {
    accountAddress: "0x8a37b79E54D69e833d79Cac3647C877Ef72830E1",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    filled: "0",
    status: "open",
    nonce: "1551036154000",
    expiryTimestampInMilliseconds: "1506550595000",
    hash: "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    createdAt: "2019-06-07T15:15:44.498Z"
  },
  {
    accountAddress: "0x8a37b79E54D69e833d79Cac3647C877Ef72830E1",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    filled: "0",
    status: "open",
    nonce: "1551036154000",
    expiryTimestampInMilliseconds: "1506550595000",
    hash: "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    createdAt: "2019-06-07T15:15:44.498Z"
  },
  {
    accountAddress: "0x8a37b79E54D69e833d79Cac3647C877Ef72830E1",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    filled: "0",
    status: "open",
    nonce: "1551036154000",
    expiryTimestampInMilliseconds: "1506550595000",
    hash: "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    createdAt: "2019-06-07T15:15:44.498Z"
  },
  {
    accountAddress: "0x8a37b79E54D69e833d79Cac3647C877Ef72830E1",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    filled: "0",
    status: "open",
    nonce: "1551036154000",
    expiryTimestampInMilliseconds: "1506550595000",
    hash: "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    createdAt: "2019-06-07T15:15:44.498Z"
  },
  {
    accountAddress: "0x8a37b79E54D69e833d79Cac3647C877Ef72830E1",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    filled: "0",
    status: "open",
    nonce: "1551036154000",
    expiryTimestampInMilliseconds: "1506550595000",
    hash: "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    createdAt: "2019-06-07T15:15:44.498Z"
  },
  {
    accountAddress: "0x8a37b79E54D69e833d79Cac3647C877Ef72830E1",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    filled: "0",
    status: "open",
    nonce: "1551036154000",
    expiryTimestampInMilliseconds: "1506550595000",
    hash: "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    createdAt: "2019-06-07T15:15:44.498Z"
  },
  {
    accountAddress: "0x8a37b79E54D69e833d79Cac3647C877Ef72830E1",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    filled: "0",
    status: "open",
    nonce: "1551036154000",
    expiryTimestampInMilliseconds: "1506550595000",
    hash: "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    createdAt: "2019-06-07T15:15:44.498Z"
  },
  {
    accountAddress: "0x8a37b79E54D69e833d79Cac3647C877Ef72830E1",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    filled: "0",
    status: "open",
    nonce: "1551036154000",
    expiryTimestampInMilliseconds: "1506550595000",
    hash: "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    createdAt: "2019-06-07T15:15:44.498Z"
  },
  {
    accountAddress: "0x8a37b79E54D69e833d79Cac3647C877Ef72830E1",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    filled: "0",
    status: "open",
    nonce: "1551036154000",
    expiryTimestampInMilliseconds: "1506550595000",
    hash: "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    createdAt: "2019-06-07T15:15:44.498Z"
  },
  {
    accountAddress: "0x8a37b79E54D69e833d79Cac3647C877Ef72830E1",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    filled: "0",
    status: "open",
    nonce: "1551036154000",
    expiryTimestampInMilliseconds: "1506550595000",
    hash: "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    createdAt: "2019-06-07T15:15:44.498Z"
  }
];

export const accountOrdersLoadAsync = accountAddress => {
  return async (dispatch, getState) => {
    const { markets } = getState();
    const { web3 } = singletons;

    const accountOrders = accountOrdersData.map(accountOrder => {
      const market = markets.all.filter(
        m =>
          (m.baseToken.address === accountOrder.giveTokenAddress &&
            m.quoteToken.address === accountOrder.takeTokenAddress) ||
          (m.quoteToken.address === accountOrder.giveTokenAddress &&
            m.baseToken.address === accountOrder.takeTokenAddress)
      )[0];
      accountOrder.marketSymbol = `${market.quoteToken.symbol}/${
        market.baseToken.symbol
      }`;
      accountOrder.type =
        accountOrder.giveTokenAddress === market.baseToken.address
          ? "buy"
          : "sell";
      accountOrder.price =
        accountOrder.type === "sell"
          ? parseFloat(accountOrder.takeAmount) /
            parseFloat(accountOrder.giveAmount)
          : parseFloat(accountOrder.giveAmount) /
            parseFloat(accountOrder.takeAmount);
      accountOrder.amount =
        accountOrder.type === "sell"
          ? web3.utils.fromWei(accountOrder.giveAmount)
          : web3.utils.fromWei(accountOrder.takeAmount);
      accountOrder.total =
        accountOrder.type === "sell"
          ? web3.utils.fromWei(accountOrder.takeAmount)
          : web3.utils.fromWei(accountOrder.giveAmount);
      accountOrder.filled = web3.utils.fromWei(accountOrder.filled);
      return accountOrder;
    });

    dispatch({
      type: ACCOUNT_ORDERS_LOAD,
      payload: { data: accountOrders }
    });
  };
};

export const accountOrdersHandleSearchInput = e => {
  return (dispatch, getState) => {
    const searchValue = e.target.value;
    dispatch(filterAccountOrders(searchValue));
  };
};

const filterAccountOrders = (searchValue, reApply = false) => {
  return (dispatch, getState) => {
    const { accountOrders, tokens } = getState();

    if (reApply) {
      searchValue = accountOrders.searchValue;
    }

    const regex = new RegExp(searchValue, "gmi");
    const allOrders = accountOrders.all;

    let filtered = [];
    for (let order of allOrders) {
      const giveToken = tokens.all.filter(
        t => t.address === order.giveTokenAddress
      )[0];
      const takeToken = tokens.all.filter(
        t => t.address === order.takeTokenAddress
      )[0];
      if (
        regex.test(giveToken.symbol) ||
        regex.test(giveToken.name) ||
        regex.test(takeToken.symbol) ||
        regex.test(takeToken.name)
      ) {
        filtered.push(order);
      }
    }

    dispatch({
      type: ACCOUNT_ORDERS_FILTER,
      payload: { filtered, searchValue }
    });
  };
};

export const accountOrdersClearSearch = () => {
  return dispatch => {
    dispatch({
      type: ACCOUNT_ORDERS_CLEAR_FILTER
    });
  };
};
