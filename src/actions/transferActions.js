import {
  TRANSFER_SHOW,
  TRANSFER_HIDE,
  TRANSFER_AMOUNT_INPUT,
  TRANSFER_ERROR,
  TRANSFER_PENDING_ON,
  TRANSFER_PENDING_OFF,
  TRANSFER_COMPLETE
} from "../actions/types";
import { getOnchainBalanceAsync, round } from "../helpers";
import singletons from "../singletons";

export const transferShow = payload => {
  return {
    type: TRANSFER_SHOW,
    payload
  };
};

export const transferHide = () => {
  return async (dispatch, getState) => {
    const { transfer } = getState();

    if (transfer.pending) {
      return;
    }

    dispatch({
      type: TRANSFER_HIDE
    });
  };
};

export const transferHandleAmountChange = e => {
  return {
    type: TRANSFER_AMOUNT_INPUT,
    payload: {
      amount: e.target.value
    }
  };
};

export const transferHandleSubmitAsync = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: TRANSFER_PENDING_ON
    });

    const { transfer } = getState();

    if (transfer.type === "deposit") {
      await depositAsync(dispatch, getState);
    } else {
      await withdrawAsync(dispatch, getState);
    }
  };
};

const depositAsync = async (dispatch, getState) => {
  const { web3 } = singletons;
  const { transfer, account, app } = getState();
  const accountAddress = account.address;
  const tokenSymbol = transfer.symbol;
  const exchangeAddress = app.contractAddress;

  if (transfer.amount === "" || parseFloat(transfer.amount) === 0) {
    dispatch({
      type: TRANSFER_ERROR,
      payload: {
        error: "Amount can't be empty."
      }
    });

    return;
  }

  const onchainBalance = await getOnchainBalanceAsync(
    accountAddress,
    tokenSymbol
  );
  if (parseFloat(onchainBalance) < parseFloat(transfer.amount)) {
    dispatch({
      type: TRANSFER_ERROR,
      payload: { error: "Insufficient balance." }
    });
    return;
  }

  const amountWei = web3.utils.toWei(transfer.amount.toString());
  const approved = await requestDepositApprovalAsync({
    accountAddress,
    amountWei,
    tokenSymbol,
    exchangeAddress
  });
  if (!approved) {
    dispatch({
      type: TRANSFER_PENDING_OFF
    });
    return;
  }

  const sent = await sendDepositTransactionAsync({
    accountAddress,
    amountWei,
    tokenSymbol
  });
  if (!sent) {
    dispatch({
      type: TRANSFER_PENDING_OFF
    });
    return;
  }

  dispatch({
    type: TRANSFER_COMPLETE
  });
};

const sendDepositTransactionAsync = ({
  accountAddress,
  amountWei,
  tokenSymbol
}) => {
  return new Promise((resolve, reject) => {
    const { exchange, tokens } = singletons;
    const value = tokenSymbol === "ETH" ? amountWei : 0;
    const tokenAddress = tokens[tokenSymbol].options.address;
    setTimeout(() => {
      exchange.methods
        .deposit(tokenAddress, amountWei)
        .send({ from: accountAddress, value })
        .on("transactionHash", () => {
          resolve(true);
        })
        .on("error", () => {
          resolve(false);
        });
    }, 1000);
  });
};

const requestDepositApprovalAsync = ({
  accountAddress,
  amountWei,
  tokenSymbol,
  exchangeAddress
}) => {
  return new Promise((resolve, reject) => {
    const { tokens } = singletons;

    if (tokenSymbol === "ETH") {
      resolve(true);
    } else {
      tokens[tokenSymbol].methods
        .approve(exchangeAddress, amountWei)
        .send({ from: accountAddress })
        .on("transactionHash", () => {
          resolve(true);
        })
        .on("error", () => {
          resolve(false);
        });
    }
  });
};

export const transferDepositEntireBalance = () => {
  return async (dispatch, getState) => {
    const { account, transfer } = getState();
    const accountAddress = account.address;
    const tokenSymbol = transfer.symbol;

    const onchainBalance = await getOnchainBalanceAsync(
      accountAddress,
      tokenSymbol
    );
    const roundedOnchainBalance = round(onchainBalance).toString();

    dispatch({
      type: TRANSFER_AMOUNT_INPUT,
      payload: {
        amount: roundedOnchainBalance
      }
    });
  };
};

const withdrawAsync = (dispatch, getState) => {
  console.log("WITHDRAW");
};
