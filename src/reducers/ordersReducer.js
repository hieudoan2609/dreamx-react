import {
  ORDERS_FILTER,
  ORDERS_CLEAR_FILTER,
  ORDERS_LOAD
} from "../actions/types";

const orders = [
  {
    accountAddress: "0x8a37b79E54D69e833d79Cac3647C877Ef72830E1",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    filled: "0",
    nonce: "1551036154000",
    expiryTimestampInMilliseconds: "1506550595000",
    hash: "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    createdAt: "1506550595"
  },
  {
    accountAddress: "0x8a37b79E54D69e833d79Cac3647C877Ef72830E1",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    filled: "0",
    nonce: "1551036154000",
    expiryTimestampInMilliseconds: "1506550595000",
    hash: "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    createdAt: "1506550595"
  },
  {
    accountAddress: "0x8a37b79E54D69e833d79Cac3647C877Ef72830E1",
    giveTokenAddress: "0x0000000000000000000000000000000000000000",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    takeAmount: "20000000000000000",
    filled: "0",
    nonce: "1551036154000",
    expiryTimestampInMilliseconds: "1506550595000",
    hash: "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    createdAt: "1506550595"
  },
  {
    accountAddress: "0x8a37b79E54D69e833d79Cac3647C877Ef72830E1",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    filled: "0",
    nonce: "1551036154000",
    expiryTimestampInMilliseconds: "1506550595000",
    hash: "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    createdAt: "1506550595"
  },
  {
    accountAddress: "0x8a37b79E54D69e833d79Cac3647C877Ef72830E1",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    filled: "0",
    nonce: "1551036154000",
    expiryTimestampInMilliseconds: "1506550595000",
    hash: "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    createdAt: "1506550595"
  },
  {
    accountAddress: "0x8a37b79E54D69e833d79Cac3647C877Ef72830E1",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    filled: "0",
    nonce: "1551036154000",
    expiryTimestampInMilliseconds: "1506550595000",
    hash: "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    createdAt: "1506550595"
  },
  {
    accountAddress: "0x8a37b79E54D69e833d79Cac3647C877Ef72830E1",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    filled: "0",
    nonce: "1551036154000",
    expiryTimestampInMilliseconds: "1506550595000",
    hash: "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    createdAt: "1506550595"
  },
  {
    accountAddress: "0x8a37b79E54D69e833d79Cac3647C877Ef72830E1",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    filled: "0",
    nonce: "1551036154000",
    expiryTimestampInMilliseconds: "1506550595000",
    hash: "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    createdAt: "1506550595"
  },
  {
    accountAddress: "0x8a37b79E54D69e833d79Cac3647C877Ef72830E1",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    filled: "0",
    nonce: "1551036154000",
    expiryTimestampInMilliseconds: "1506550595000",
    hash: "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    createdAt: "1506550595"
  },
  {
    accountAddress: "0x8a37b79E54D69e833d79Cac3647C877Ef72830E1",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    filled: "0",
    nonce: "1551036154000",
    expiryTimestampInMilliseconds: "1506550595000",
    hash: "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    createdAt: "1506550595"
  },
  {
    accountAddress: "0x8a37b79E54D69e833d79Cac3647C877Ef72830E1",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    filled: "0",
    nonce: "1551036154000",
    expiryTimestampInMilliseconds: "1506550595000",
    hash: "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    createdAt: "1506550595"
  },
  {
    accountAddress: "0x8a37b79E54D69e833d79Cac3647C877Ef72830E1",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    filled: "0",
    nonce: "1551036154000",
    expiryTimestampInMilliseconds: "1506550595000",
    hash: "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    createdAt: "1506550595"
  },
  {
    accountAddress: "0x8a37b79E54D69e833d79Cac3647C877Ef72830E1",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    filled: "0",
    nonce: "1551036154000",
    expiryTimestampInMilliseconds: "1506550595000",
    hash: "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    createdAt: "1506550595"
  },
  {
    accountAddress: "0x8a37b79E54D69e833d79Cac3647C877Ef72830E1",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    filled: "0",
    nonce: "1551036154000",
    expiryTimestampInMilliseconds: "1506550595000",
    hash: "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    createdAt: "1506550595"
  },
  {
    accountAddress: "0x8a37b79E54D69e833d79Cac3647C877Ef72830E1",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    filled: "0",
    nonce: "1551036154000",
    expiryTimestampInMilliseconds: "1506550595000",
    hash: "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    createdAt: "1506550595"
  },
  {
    accountAddress: "0x8a37b79E54D69e833d79Cac3647C877Ef72830E1",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    filled: "0",
    nonce: "1551036154000",
    expiryTimestampInMilliseconds: "1506550595000",
    hash: "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    createdAt: "1506550595"
  },
  {
    accountAddress: "0x8a37b79E54D69e833d79Cac3647C877Ef72830E1",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    filled: "0",
    nonce: "1551036154000",
    expiryTimestampInMilliseconds: "1506550595000",
    hash: "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    createdAt: "1506550595"
  },
  {
    accountAddress: "0x8a37b79E54D69e833d79Cac3647C877Ef72830E1",
    giveTokenAddress: "0xe62cc4212610289d7374f72c2390a40e78583350",
    giveAmount: "10000000000000000",
    takeTokenAddress: "0x0000000000000000000000000000000000000000",
    takeAmount: "20000000000000000",
    filled: "0",
    nonce: "1551036154000",
    expiryTimestampInMilliseconds: "1506550595000",
    hash: "0x853c9a43f316e19a8bc5b0e8513d7dd500b5df308dd1b558721c40beeec3541b",
    createdAt: "1506550595"
  }
];

const INITIAL_STATE = {
  all: orders,
  filtered: orders,
  searchValue: ""
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ORDERS_LOAD:
      if (state.searchValue) {
        return {
          ...state,
          all: action.payload.transfers
        };
      } else {
        return {
          ...state,
          all: action.payload.transfers,
          filtered: action.payload.transfers
        };
      }
    case ORDERS_FILTER:
      return {
        ...state,
        filtered: action.payload.filtered,
        searchValue: action.payload.searchValue
      };
    case ORDERS_CLEAR_FILTER:
      return {
        ...state,
        filtered: state.all,
        searchValue: ""
      };
    default:
      return state;
  }
};
