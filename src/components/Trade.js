import axios from "axios";
import React, { Component } from "react";
import * as Web3Utils from "web3-utils";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./Trade.scss";
import TabMenu from "./TabMenu";
import Button from "./Button";
import { truncateNumberInput, truncateNumberOutput } from "../helpers";
import singletons from "../singletons";
import config from "../config";
import Loading from './Loading'

const INITIAL_STATE = {
  tabs: ["buy", "sell"],
  currentTab: "buy",
  price: "",
  priceWei: "",
  amount: "",
  amountWei: "",
  fee: "0",
  total: "0",
  pending: false,
  feedback: {}, // { type, message }
  totalMinusFee: "0",
  amountMinusFee: "0"
};

class Trade extends Component {
  state = INITIAL_STATE;

  componentDidMount = () => {
    this.props.onRef(this)
  }

  componentWillUnmount = () => {
    this.props.onRef(undefined)
  }

  handleTabChange = tab => {
    const { price, priceWei, amount, amountWei, fee, total, feedback, totalMinusFee, amountMinusFee } = INITIAL_STATE
    this.setState({ currentTab: tab, price, priceWei, amount, amountWei, fee, total, feedback, totalMinusFee, amountMinusFee });
  };

  renderNotLoggedInOverlay = () => {
    if (!this.props.loggedIn) {
      return <div className="not-logged-in">Please log in to trade.</div>;
    }
  };

  renderBalance = () => {
    if (!this.props.base || !this.props.quote) {
      return (
        <div className="balance">
          <div className="header">BALANCE</div>
          <div className="value">Not available.</div>
        </div>
      );
    }

    let balance, symbol;
    if (this.state.currentTab === "buy") {
      [balance, symbol] = [this.props.base.balance, this.props.base.symbol];
    } else {
      [balance, symbol] = [this.props.quote.balance, this.props.quote.symbol];
    }
    return (
      <div className="balance">
        <div className="header">BALANCE</div>
        <div className="value">
          {truncateNumberOutput(Web3Utils.fromWei(balance))} {symbol}
        </div>
      </div>
    );
  };

  calculateFeeAndTotal = (amountWei, priceWei) => {
    const { currentTab } = this.state;
    let { makerFee, takerFee } = this.props;
    const oneEther = Web3Utils.toBN(1000000000000000000);

    let total, fee, totalMinusFee, amountMinusFee;
    if (amountWei && amountWei !== "0" && priceWei && priceWei !== "0") {
      [ amountWei, priceWei, makerFee, takerFee ] = [ Web3Utils.toBN(amountWei), Web3Utils.toBN(priceWei), Web3Utils.toBN(makerFee), Web3Utils.toBN(takerFee) ];
      total = priceWei.mul(amountWei).div(oneEther);
      fee = currentTab === "buy" ? amountWei.mul(makerFee).div(oneEther) : total.mul(takerFee).div(oneEther);
      totalMinusFee = total.sub(fee);
      amountMinusFee = amountWei.sub(fee);
    } else {
      total = 0;
      fee = 0;
      totalMinusFee = 0;
      amountMinusFee = 0;
    }

    [ total, fee, totalMinusFee, amountMinusFee ] = [ total.toString(), fee.toString(), totalMinusFee.toString(), amountMinusFee.toString() ]
    return { total, fee, totalMinusFee, amountMinusFee };
  };

  onAmountChange = value => {
    const { priceWei } = this.state;
    const amount = truncateNumberInput(value);
    const amountWei = amount ? Web3Utils.toWei(amount) : "0";
    const { total, fee, totalMinusFee, amountMinusFee } = this.calculateFeeAndTotal( amountWei, priceWei );
    this.setState({ amount, amountWei, total, fee, totalMinusFee, amountMinusFee });
  };

  onPriceChange = value => {
    const { amountWei } = this.state;
    const price = truncateNumberInput(value);
    const priceWei = price ? Web3Utils.toWei(price) : "0";
    const { total, fee, totalMinusFee, amountMinusFee } = this.calculateFeeAndTotal( amountWei, priceWei );
    this.setState({ price, priceWei, total, fee, totalMinusFee, amountMinusFee });
  };

  calculateFeePercent = () => {
    let feePerToken;
    if (this.state.currentTab === "buy") {
      feePerToken = this.props.makerFee;
    } else {
      feePerToken = this.props.takerFee;
    }
    const feePercent = (parseFloat(Web3Utils.fromWei(feePerToken)) * 100) / 1;
    return feePercent;
  };

  renderFeeAndTotal = () => {
    if (!this.props.base || !this.props.quote) {
      return;
    }

    if (this.state.currentTab === "buy") {
      return (
        <div className="fee-and-total">
          <small className="fee">
            Fee ({this.calculateFeePercent()}%):{" "}
            <b>{truncateNumberOutput(Web3Utils.fromWei(this.state.fee))} {this.props.quote.symbol}</b>
          </small>
          <small className="total">
            Total: <b>{truncateNumberOutput(Web3Utils.fromWei(this.state.amountMinusFee))} {this.props.quote.symbol}</b>
          </small>
        </div>
      )
    } else {
      return (
        <div className="fee-and-total">
          <small className="fee">
            Fee ({this.calculateFeePercent()}%):{" "}
            <b>{truncateNumberOutput(Web3Utils.fromWei(this.state.fee))} {this.props.base.symbol}</b>
          </small>
          <small className="total">
            Total: <b>{truncateNumberOutput(Web3Utils.fromWei(this.state.totalMinusFee))} {this.props.base.symbol}</b>
          </small>
        </div>
      )
    }
  }

  renderAmountAndPrice = () => {
    if (!this.props.base || !this.props.quote) {
      return;
    }

    return (
      <div className="amount-and-price">
        <div className="input-group">
          <input
            className={`form-control`}
            placeholder={`Amount`}
            spellCheck="false"
            value={this.state.amount}
            onChange={(e) => this.onAmountChange(e.target.value)}
            disabled={this.state.pending ? true : false}
          />
          <div className="input-group-append">
            <div className="input-group-text">{this.props.quote.symbol}</div>
          </div>
        </div>

        <div className="input-group">
          <input
            className={`form-control`}
            placeholder="Price"
            spellCheck="false"
            value={this.state.price}
            onChange={(e) => this.onPriceChange(e.target.value)}
            disabled={this.state.pending ? true : false}
          />
          <div className="input-group-append">
            <div className="input-group-text">{this.props.base.symbol}</div>
          </div>
        </div>
        <div className={`feedback ${this.state.feedback.type}`}>{this.state.feedback.message}</div>
      </div>
    );
  };

  submitAsync = async () => {
    this.setState({ feedback: {}, pending: true })

    if (!this.state.amountWei) {
      this.setState({ feedback: { type: 'error', message: 'Amount cannot be empty.' }, pending: false });
      return;
    };
    if (!this.state.priceWei) {
      this.setState({ feedback: { type: 'error', message: 'Price cannot be empty.' }, pending: false });
      return;
    };
    if (this.state.currentTab === 'buy') {
      if (Web3Utils.toBN(this.state.total).lt(Web3Utils.toBN(this.props.makerMinimum))) {
        this.setState({ feedback: { type: 'error', message: `Minimum order is ${Web3Utils.fromWei(this.props.makerMinimum)} ${this.props.base.symbol}.` }, pending: false });
        return;
      }
      if (Web3Utils.toBN(this.state.total).gt(Web3Utils.toBN(this.props.base.balance))) {
        this.setState({ feedback: { type: 'error', message: 'Not enough balance.' }, pending: false });
        return;
      }
    } else {
      if (Web3Utils.toBN(this.state.total).lt(Web3Utils.toBN(this.props.takerMinimum))) {
        this.setState({ feedback: { type: 'error', message: `Minimum order is ${Web3Utils.fromWei(this.props.takerMinimum)} ${this.props.base.symbol}.` }, pending: false });
        return;
      }
      if (Web3Utils.toBN(this.state.amountWei).gt(Web3Utils.toBN(this.props.quote.balance))) {
        this.setState({ feedback: { type: 'error', message: 'Not enough balance.' }, pending: false });
        return;
      }
    }

    await this.orderAsync()
  };

  orderAsync = async () => {
    const { price, priceWei, amount, amountWei, fee, total, totalMinusFee, amountMinusFee } = INITIAL_STATE
    const { API_HTTP_ROOT } = config;
    const { app, account, base, quote } = this.props
    const orderType = this.state.currentTab
    const contractAddress = app.contractAddress
    const accountAddress = account.address
    let giveTokenAddress, giveAmount, takeTokenAddress, takeAmount
    if (orderType === 'buy') {
      giveTokenAddress = base.address
      giveAmount = this.state.total
      takeTokenAddress = quote.address
      takeAmount = this.state.amountWei
    } else {
      giveTokenAddress = quote.address
      giveAmount = this.state.amountWei
      takeTokenAddress = base.address
      takeAmount = this.state.total
    }
    const expiryTimestampInMilliseconds = 33117212071000;
    const payload = await this.generateOrderPayloadAsync({ contractAddress, accountAddress, giveTokenAddress, giveAmount, takeTokenAddress, takeAmount, expiryTimestampInMilliseconds })

    if (!payload) {
      this.setState({ pending: false })
      return;
    }

    try {
      await axios.post(
        `${API_HTTP_ROOT}/orders`,
        payload
      );
      const feedback = { type: 'success', message: 'Your order has been submitted.' }
      this.setState({ pending: false, price, priceWei, amount, amountWei, fee, total, totalMinusFee, amountMinusFee, feedback })
    } catch (err) {
      const feedback = { type: 'error', message: 'Service is unvailable, please try again later.' }
      if (err.toString() === "Error: Request failed with status code 503") {
        this.setState({ pending: false, feedback })
      }
    }
  }

  generateOrderPayloadAsync = async ({
    contractAddress,
    accountAddress,
    giveTokenAddress,
    giveAmount,
    takeTokenAddress,
    takeAmount,
    expiryTimestampInMilliseconds
  }) => {
    const { web3 } = singletons;
    const nonce = Date.now();
    const hash = web3.utils.soliditySha3(
      contractAddress,
      accountAddress,
      giveTokenAddress,
      giveAmount,
      takeTokenAddress,
      takeAmount,
      nonce,
      expiryTimestampInMilliseconds
    );
    try {
      const signature = await web3.eth.personal.sign(hash, accountAddress, undefined);
      const payload = {
        "account_address": accountAddress,
        "give_token_address": giveTokenAddress,
        "give_amount": giveAmount,
        "take_token_address": takeTokenAddress,
        "take_amount": takeAmount,
        "nonce": nonce,
        "expiry_timestamp_in_milliseconds": expiryTimestampInMilliseconds,
        "order_hash": hash,
        signature
      }
      return payload;
    } catch {
      return;
    }
  }

  render() {
    return (
      <div className={`Trade card ${this.props.theme}`}>
        <Loading
          active={this.props.loading}
          type="absolute"
          theme={this.props.theme}
        />
        
        {this.renderNotLoggedInOverlay()}
        <TabMenu
          items={this.state.tabs}
          currentItem={this.state.currentTab}
          theme={this.props.theme}
          onChange={this.handleTabChange}
          disabled={this.state.pending}
        />
        <div className="body">
          {this.renderBalance()}

          {this.renderAmountAndPrice()}

          {this.renderFeeAndTotal()}

          <div className="submit">
            <Button theme={this.props.theme} fullWidth={true} onClick={this.submitAsync} pending={this.state.pending}>
              {this.state.currentTab}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return state;
};

// const mapActionsToProps = {
//  getTradeData
// };

Trade.propTypes = {
  theme: PropTypes.string.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  base: PropTypes.object, // { symbol, balance, address }
  quote: PropTypes.object, // { symbol, balance, address }
  makerFee: PropTypes.string.isRequired,
  makerMinimum: PropTypes.string.isRequired,
  takerFee: PropTypes.string.isRequired,
  takerMinimum: PropTypes.string.isRequired,
  onRef: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(Trade);
