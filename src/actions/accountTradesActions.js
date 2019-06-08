import {
  ACCOUNT_TRADES_FILTER,
  ACCOUNT_TRADES_LOAD,
  ACCOUNT_TRADES_CLEAR_FILTER
} from "../actions/types";
import singletons from "../singletons";

const accountTradesData = [
  {
    id: "1885452",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    orderHash:
      "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    uuid: "ca5ca940-cd78-11e8-812d-3b7d27265b69",
    makerFee: "23000",
    takerFee: "123300",
    makerAddress: "0x5b0ca08aac665a36158ced95c676fd5a59ed0c73",
    takerAddress: "0x7e85cad78cf70b62a6e1087cbe77ca126dbede00",
    transactionHash:
      "0x1b651d0c0578008296f0edf237fdbece67797a0bee9a28c5e4313e44844b25a2",
    createdAt: "2018-06-28 12:21:15"
  },
  {
    id: "1885452",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    orderHash:
      "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    uuid: "ca5ca940-cd78-11e8-812d-3b7d27265b69",
    makerFee: "23000",
    takerFee: "123300",
    makerAddress: "0x5b0ca08aac665a36158ced95c676fd5a59ed0c73",
    takerAddress: "0x7e85cad78cf70b62a6e1087cbe77ca126dbede00",
    transactionHash:
      "0x1b651d0c0578008296f0edf237fdbece67797a0bee9a28c5e4313e44844b25a2",
    createdAt: "2018-06-28 12:21:15"
  },
  {
    id: "1885452",
    giveTokenAddress: "0x0000000000000000000000000000000000000000",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    takeAmount: "20000000000000000",
    orderHash:
      "0xfe4c3f5cdbf185b452466f9449d66a44464d9b9b4adee6ef75e536c7d579316a",
    uuid: "ca5ca940-cd78-11e8-812d-3b7d27265b69",
    makerFee: "23000",
    takerFee: "123300",
    makerAddress: "0x5b0ca08aac665a36158ced95c676fd5a59ed0c73",
    takerAddress: "0x7e85cad78cf70b62a6e1087cbe77ca126dbede00",
    transactionHash:
      "0x1b651d0c0578008296f0edf237fdbece67797a0bee9a28c5e4313e44844b25a2",
    createdAt: "2018-06-28 12:21:15"
  },
  {
    id: "1885452",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    orderHash:
      "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    uuid: "ca5ca940-cd78-11e8-812d-3b7d27265b69",
    makerFee: "23000",
    takerFee: "123300",
    makerAddress: "0x5b0ca08aac665a36158ced95c676fd5a59ed0c73",
    takerAddress: "0x7e85cad78cf70b62a6e1087cbe77ca126dbede00",
    transactionHash:
      "0x1b651d0c0578008296f0edf237fdbece67797a0bee9a28c5e4313e44844b25a2",
    createdAt: "2018-06-28 12:21:15"
  },
  {
    id: "1885452",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    orderHash:
      "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    uuid: "ca5ca940-cd78-11e8-812d-3b7d27265b69",
    makerFee: "23000",
    takerFee: "123300",
    makerAddress: "0x5b0ca08aac665a36158ced95c676fd5a59ed0c73",
    takerAddress: "0x7e85cad78cf70b62a6e1087cbe77ca126dbede00",
    transactionHash:
      "0x1b651d0c0578008296f0edf237fdbece67797a0bee9a28c5e4313e44844b25a2",
    createdAt: "2018-06-28 12:21:15"
  },
  {
    id: "1885452",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    orderHash:
      "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    uuid: "ca5ca940-cd78-11e8-812d-3b7d27265b69",
    makerFee: "23000",
    takerFee: "123300",
    makerAddress: "0x5b0ca08aac665a36158ced95c676fd5a59ed0c73",
    takerAddress: "0x7e85cad78cf70b62a6e1087cbe77ca126dbede00",
    transactionHash:
      "0x1b651d0c0578008296f0edf237fdbece67797a0bee9a28c5e4313e44844b25a2",
    createdAt: "2018-06-28 12:21:15"
  },
  {
    id: "1885452",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    orderHash:
      "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    uuid: "ca5ca940-cd78-11e8-812d-3b7d27265b69",
    makerFee: "23000",
    takerFee: "123300",
    makerAddress: "0x5b0ca08aac665a36158ced95c676fd5a59ed0c73",
    takerAddress: "0x7e85cad78cf70b62a6e1087cbe77ca126dbede00",
    transactionHash:
      "0x1b651d0c0578008296f0edf237fdbece67797a0bee9a28c5e4313e44844b25a2",
    createdAt: "2018-06-28 12:21:15"
  },
  {
    id: "1885452",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    orderHash:
      "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    uuid: "ca5ca940-cd78-11e8-812d-3b7d27265b69",
    makerFee: "23000",
    takerFee: "123300",
    makerAddress: "0x5b0ca08aac665a36158ced95c676fd5a59ed0c73",
    takerAddress: "0x7e85cad78cf70b62a6e1087cbe77ca126dbede00",
    transactionHash:
      "0x1b651d0c0578008296f0edf237fdbece67797a0bee9a28c5e4313e44844b25a2",
    createdAt: "2018-06-28 12:21:15"
  },
  {
    id: "1885452",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    orderHash:
      "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    uuid: "ca5ca940-cd78-11e8-812d-3b7d27265b69",
    makerFee: "23000",
    takerFee: "123300",
    makerAddress: "0x5b0ca08aac665a36158ced95c676fd5a59ed0c73",
    takerAddress: "0x7e85cad78cf70b62a6e1087cbe77ca126dbede00",
    transactionHash:
      "0x1b651d0c0578008296f0edf237fdbece67797a0bee9a28c5e4313e44844b25a2",
    createdAt: "2018-06-28 12:21:15"
  },
  {
    id: "1885452",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    orderHash:
      "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    uuid: "ca5ca940-cd78-11e8-812d-3b7d27265b69",
    makerFee: "23000",
    takerFee: "123300",
    makerAddress: "0x5b0ca08aac665a36158ced95c676fd5a59ed0c73",
    takerAddress: "0x7e85cad78cf70b62a6e1087cbe77ca126dbede00",
    transactionHash:
      "0x1b651d0c0578008296f0edf237fdbece67797a0bee9a28c5e4313e44844b25a2",
    createdAt: "2018-06-28 12:21:15"
  },
  {
    id: "1885452",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    orderHash:
      "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    uuid: "ca5ca940-cd78-11e8-812d-3b7d27265b69",
    makerFee: "23000",
    takerFee: "123300",
    makerAddress: "0x5b0ca08aac665a36158ced95c676fd5a59ed0c73",
    takerAddress: "0x7e85cad78cf70b62a6e1087cbe77ca126dbede00",
    transactionHash:
      "0x1b651d0c0578008296f0edf237fdbece67797a0bee9a28c5e4313e44844b25a2",
    createdAt: "2018-06-28 12:21:15"
  },
  {
    id: "1885452",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    orderHash:
      "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    uuid: "ca5ca940-cd78-11e8-812d-3b7d27265b69",
    makerFee: "23000",
    takerFee: "123300",
    makerAddress: "0x5b0ca08aac665a36158ced95c676fd5a59ed0c73",
    takerAddress: "0x7e85cad78cf70b62a6e1087cbe77ca126dbede00",
    transactionHash:
      "0x1b651d0c0578008296f0edf237fdbece67797a0bee9a28c5e4313e44844b25a2",
    createdAt: "2018-06-28 12:21:15"
  },
  {
    id: "1885452",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    orderHash:
      "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    uuid: "ca5ca940-cd78-11e8-812d-3b7d27265b69",
    makerFee: "23000",
    takerFee: "123300",
    makerAddress: "0x5b0ca08aac665a36158ced95c676fd5a59ed0c73",
    takerAddress: "0x7e85cad78cf70b62a6e1087cbe77ca126dbede00",
    transactionHash:
      "0x1b651d0c0578008296f0edf237fdbece67797a0bee9a28c5e4313e44844b25a2",
    createdAt: "2018-06-28 12:21:15"
  },
  {
    id: "1885452",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    orderHash:
      "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    uuid: "ca5ca940-cd78-11e8-812d-3b7d27265b69",
    makerFee: "23000",
    takerFee: "123300",
    makerAddress: "0x5b0ca08aac665a36158ced95c676fd5a59ed0c73",
    takerAddress: "0x7e85cad78cf70b62a6e1087cbe77ca126dbede00",
    transactionHash:
      "0x1b651d0c0578008296f0edf237fdbece67797a0bee9a28c5e4313e44844b25a2",
    createdAt: "2018-06-28 12:21:15"
  },
  {
    id: "1885452",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    orderHash:
      "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    uuid: "ca5ca940-cd78-11e8-812d-3b7d27265b69",
    makerFee: "23000",
    takerFee: "123300",
    makerAddress: "0x5b0ca08aac665a36158ced95c676fd5a59ed0c73",
    takerAddress: "0x7e85cad78cf70b62a6e1087cbe77ca126dbede00",
    transactionHash:
      "0x1b651d0c0578008296f0edf237fdbece67797a0bee9a28c5e4313e44844b25a2",
    createdAt: "2018-06-28 12:21:15"
  },
  {
    id: "1885452",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    orderHash:
      "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    uuid: "ca5ca940-cd78-11e8-812d-3b7d27265b69",
    makerFee: "23000",
    takerFee: "123300",
    makerAddress: "0x5b0ca08aac665a36158ced95c676fd5a59ed0c73",
    takerAddress: "0x7e85cad78cf70b62a6e1087cbe77ca126dbede00",
    transactionHash:
      "0x1b651d0c0578008296f0edf237fdbece67797a0bee9a28c5e4313e44844b25a2",
    createdAt: "2018-06-28 12:21:15"
  },
  {
    id: "1885452",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    orderHash:
      "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    uuid: "ca5ca940-cd78-11e8-812d-3b7d27265b69",
    makerFee: "23000",
    takerFee: "123300",
    makerAddress: "0x5b0ca08aac665a36158ced95c676fd5a59ed0c73",
    takerAddress: "0x7e85cad78cf70b62a6e1087cbe77ca126dbede00",
    transactionHash:
      "0x1b651d0c0578008296f0edf237fdbece67797a0bee9a28c5e4313e44844b25a2",
    createdAt: "2018-06-28 12:21:15"
  },
  {
    id: "1885452",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    orderHash:
      "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    uuid: "ca5ca940-cd78-11e8-812d-3b7d27265b69",
    makerFee: "23000",
    takerFee: "123300",
    makerAddress: "0x5b0ca08aac665a36158ced95c676fd5a59ed0c73",
    takerAddress: "0x7e85cad78cf70b62a6e1087cbe77ca126dbede00",
    transactionHash:
      "0x1b651d0c0578008296f0edf237fdbece67797a0bee9a28c5e4313e44844b25a2",
    createdAt: "2018-06-28 12:21:15"
  }
];

export const accountTradesLoadAsync = accountAddress => {
  return async (dispatch, getState) => {
    const { markets, account } = getState();
    const { web3 } = singletons;

    const accountTrades = accountTradesData.map(t => {
      const market = markets.all.filter(
        m =>
          (m.baseToken.address === t.giveTokenAddress &&
            m.quoteToken.address === t.takeTokenAddress) ||
          (m.quoteToken.address === t.giveTokenAddress &&
            m.baseToken.address === t.takeTokenAddress)
      )[0];
      t.marketSymbol = `${market.quoteToken.symbol}/${market.baseToken.symbol}`;
      t.type = t.giveTokenAddress === market.baseToken.address ? "buy" : "sell";
      t.price =
        t.type === "sell"
          ? parseFloat(t.takeAmount) / parseFloat(t.giveAmount)
          : parseFloat(t.giveAmount) / parseFloat(t.takeAmount);
      t.amount =
        t.type === "sell"
          ? web3.utils.fromWei(t.giveAmount)
          : web3.utils.fromWei(t.takeAmount);
      t.fee =
        t.makerAddress === account.address
          ? web3.utils.fromWei(t.makerFee)
          : web3.utils.fromWei(t.takerFee);
      t.total =
        t.type === "sell"
          ? web3.utils.fromWei(t.takeAmount)
          : web3.utils.fromWei(t.giveAmount);
      return t;
    });

    dispatch({
      type: ACCOUNT_TRADES_LOAD,
      payload: { data: accountTrades }
    });
  };
};

export const accountTradesHandleSearchInput = e => {
  return (dispatch, getState) => {
    const searchValue = e.target.value;
    dispatch(filterAccountTrades(searchValue));
  };
};

const filterAccountTrades = (searchValue, reApply = false) => {
  return (dispatch, getState) => {
    const { accountTrades, tokens } = getState();

    if (reApply) {
      searchValue = accountTrades.searchValue;
    }

    const regex = new RegExp(searchValue, "gmi");
    const allTrades = accountTrades.all;

    let filtered = [];
    for (let trade of allTrades) {
      const giveToken = tokens.all.filter(
        t => t.address === trade.giveTokenAddress
      )[0];
      const takeToken = tokens.all.filter(
        t => t.address === trade.takeTokenAddress
      )[0];
      if (
        regex.test(giveToken.symbol) ||
        regex.test(giveToken.name) ||
        regex.test(takeToken.symbol) ||
        regex.test(takeToken.name)
      ) {
        filtered.push(trade);
      }
    }

    dispatch({
      type: ACCOUNT_TRADES_FILTER,
      payload: { filtered, searchValue }
    });
  };
};

export const accountTradesClearSearch = () => {
  return dispatch => {
    dispatch({
      type: ACCOUNT_TRADES_CLEAR_FILTER
    });
  };
};
