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
  return {
    type: TRANSFER_HIDE
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
  // const tokenAddress = transfer.address;
  const amountWei = web3.utils.toWei(transfer.amount.toString());
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

  // let approved = false;
  // if (tokenSymbol !== "ETH") {
  //   try {
  //     dispatch({
  //       type: TRANSFER_PENDING_ON
  //     });
  //     await tokens[tokenSymbol].methods
  //       .approve(exchangeAddress, amountWei)
  //       .send({ from: accountAddress });
  //     approved = true;
  //   } catch (error) {
  //     dispatch({
  //       type: TRANSFER_PENDING_OFF
  //     });
  //   }
  // } else {
  //   approved = true;
  // }

  // call the deposit method on the exchange contract

  tokens[tokenSymbol].methods
    .approve(exchangeAddress, amountWei)
    .send({ from: accountAddress })
    .on("receipt", console.log);
};

const withdrawAsync = (dispatch, getState) => {
  console.log("WITHDRAW");
};
