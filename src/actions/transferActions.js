import {
  TRANSFER_SHOW,
  TRANSFER_HIDE,
  TRANSFER_AMOUNT_INPUT,
  TRANSFER_ERROR,
  TRANSFER_PENDING_ON,
  TRANSFER_PENDING_OFF
} from "../actions/types";
import { getOnchainBalanceAsync } from "../helpers";
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
  const { tokens, web3 } = singletons;
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

  const amountWei = web3.utils.toWei(transfer.amount.toString());
  const value = tokenSymbol === "ETH" ? amountWei : 0;

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

  const approved = await requestDepositApprovalAsync({
    dispatch,
    accountAddress,
    amountWei,
    tokenSymbol,
    exchangeAddress
  });

  if (!approved) {
    return;
  }

  // try {
  //   dispatch({
  //     type: TRANSFER,
  //     payload: { pending: true, error: "" }
  //   });
  //   await exchangeInstance.methods
  //     .deposit(assetAddress, amount)
  //     .send({ from: user, value });
  // } catch (error) {
  //   dispatch({
  //     type: TRANSFER,
  //     payload: { pending: false }
  //   });
  //   err = error;
  // }
  // if (!err) {
  //   dispatch({
  //     type: TRANSFER,
  //     payload: { pending: false }
  //   });

  //   var $ = window.$;
  //   $("#transfer").modal("close");
  //   $("#transferComplete").modal("open");
  // }

  console.log(approved);

  dispatch({
    type: TRANSFER_PENDING_OFF
  });
};

const requestDepositApprovalAsync = ({
  dispatch,
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
          dispatch({
            type: TRANSFER_PENDING_OFF
          });
          resolve(false);
        });
    }
  });
};

const withdrawAsync = (dispatch, getState) => {
  console.log("WITHDRAW");
};
