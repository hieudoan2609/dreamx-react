import axios from "axios";

import {
  TRANSFER_SHOW,
  TRANSFER_HIDE,
  TRANSFER_AMOUNT_INPUT,
  TRANSFER_ERROR,
  TRANSFER_PENDING_ON,
  TRANSFER_PENDING_OFF,
  TRANSFER_COMPLETE,
  TRANSFER_FAILED
} from "../actions/types";
import { getOnchainBalanceAsync, truncateNumberInput } from "../helpers";
import singletons from "../singletons";
import config from "../config";
import { updateTransfersAsync } from ".";

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
  const { web3 } = singletons;
  let amount = truncateNumberInput(e.target.value);
  const amountWei = amount ? web3.utils.toWei(amount) : "0";
  return {
    type: TRANSFER_AMOUNT_INPUT,
    payload: {
      amount,
      amountWei
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

  if (transfer.amount === "" || parseInt(transfer.amountWei) === 0) {
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
  if (parseInt(onchainBalance) < parseInt(transfer.amountWei)) {
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
  return new Promise(async (resolve, reject) => {
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

export const transferEnterEntireBalance = () => {
  return async (dispatch, getState) => {
    const { transfer } = getState();

    if (transfer.type === "deposit") {
      depositEntireBalanceAsync(dispatch, getState);
    } else {
      withdrawEntireBalanceAsync(dispatch, getState);
    }
  };
};

const withdrawEntireBalanceAsync = (dispatch, getState) => {
  const { web3 } = singletons;
  const { tokens, transfer } = getState();
  const tokenSymbol = transfer.symbol;
  const token = tokens.all.filter(t => t.symbol === tokenSymbol)[0];

  const amountWei = token.availableBalance;
  const amount = web3.utils.fromWei(amountWei);

  dispatch({
    type: TRANSFER_AMOUNT_INPUT,
    payload: {
      amount,
      amountWei
    }
  });
};

const depositEntireBalanceAsync = async (dispatch, getState) => {
  const { web3 } = singletons;
  const { account, transfer } = getState();
  const accountAddress = account.address;
  const tokenSymbol = transfer.symbol;

  const amountWei = await getOnchainBalanceAsync(accountAddress, tokenSymbol);
  const amount = web3.utils.fromWei(amountWei);

  dispatch({
    type: TRANSFER_AMOUNT_INPUT,
    payload: {
      amount,
      amountWei
    }
  });
};

const withdrawAsync = async (dispatch, getState) => {
  const { web3 } = singletons;
  const { API_HTTP_ROOT } = config;
  const { transfer, tokens, account, app } = getState();
  const tokenSymbol = transfer.symbol;
  const accountAddress = account.address;

  if (transfer.amount === "" || parseFloat(transfer.amount) === 0) {
    dispatch({
      type: TRANSFER_ERROR,
      payload: {
        error: "Amount can't be empty."
      }
    });

    return;
  }

  const token = tokens.all.filter(token => token.symbol === tokenSymbol)[0];
  const tokenAddress = token.address;
  const availableBalance = token.availableBalance;
  const amountWei = transfer.amountWei;
  const contractAddress = app.contractAddress;
  const minimumAmount = token.withdrawMinimum;
  if (parseInt(availableBalance) < parseInt(amountWei)) {
    dispatch({
      type: TRANSFER_ERROR,
      payload: { error: "Insufficient balance." }
    });
    return;
  }
  if (parseInt(minimumAmount) > parseInt(amountWei)) {
    dispatch({
      type: TRANSFER_ERROR,
      payload: {
        error: `Amount is too small, minimal amount is ${web3.utils.fromWei(
          minimumAmount
        )}.`
      }
    });
    return;
  }

  const payload = await generateWithdrawPayloadAsync({
    accountAddress,
    amountWei,
    tokenAddress,
    contractAddress
  });

  if (!payload) {
    dispatch({
      type: TRANSFER_PENDING_OFF
    });
    return;
  }

  try {
    const newWithdraw = (await axios.post(
      `${API_HTTP_ROOT}/withdraws`,
      payload
    )).data;

    await dispatch(updateTransfersAsync(newWithdraw));

    dispatch({
      type: TRANSFER_COMPLETE
    });
  } catch (err) {
    if (err.toString() === "Error: Request failed with status code 503") {
      dispatch({
        type: TRANSFER_FAILED
      });
    }
  }
};

const generateWithdrawPayloadAsync = async ({
  accountAddress,
  amountWei,
  tokenAddress,
  contractAddress
}) => {
  const { web3 } = singletons;
  const nonce = Date.now();
  const hash = web3.utils.soliditySha3(
    contractAddress,
    tokenAddress,
    amountWei,
    accountAddress,
    nonce
  );
  try {
    const signature = await web3.eth.personal.sign(hash, accountAddress);
    const payload = {
      account_address: accountAddress,
      amount: amountWei,
      token_address: tokenAddress,
      nonce,
      withdraw_hash: hash,
      signature
    };
    return payload;
  } catch {
    return;
  }
};
