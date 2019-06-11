import React, { Component } from "react";
import Web3 from "web3";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./Trade.scss";
import TabMenu from "./TabMenu";
import Button from "./Button";
import { truncateNumberInput, truncateNumberOutput } from "../helpers";

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
  error: "",
  totalMinusFee: "0",
  amountMinusFee: "0"
};

class Trade extends Component {
  state = INITIAL_STATE;

  handleTabChange = tab => {
    const { price, priceWei, amount, amountWei, fee, total, error, totalMinusFee, amountMinusFee } = INITIAL_STATE
    this.setState({ currentTab: tab, price, priceWei, amount, amountWei, fee, total, error, totalMinusFee, amountMinusFee });
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
          {truncateNumberOutput(Web3.utils.fromWei(balance))} {symbol}
        </div>
      </div>
    );
  };

  calculateFeeAndTotal = (amountWei, priceWei) => {
    const { currentTab } = this.state;
    let { makerFee, takerFee } = this.props;
    const oneEther = Web3.utils.toBN(1000000000000000000);

    let total, fee, totalMinusFee, amountMinusFee;
    if (amountWei && amountWei !== "0" && priceWei && priceWei !== "0") {
      [ amountWei, priceWei, makerFee, takerFee ] = [ Web3.utils.toBN(amountWei), Web3.utils.toBN(priceWei), Web3.utils.toBN(makerFee), Web3.utils.toBN(takerFee) ];
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

  onAmountChange = e => {
    const { priceWei } = this.state;
    const amount = truncateNumberInput(e.target.value);
    const amountWei = amount ? Web3.utils.toWei(amount) : "0";
    const { total, fee, totalMinusFee, amountMinusFee } = this.calculateFeeAndTotal( amountWei, priceWei );
    this.setState({ amount, amountWei, total, fee, totalMinusFee, amountMinusFee });
  };

  onPriceChange = e => {
    const { amountWei } = this.state;
    const price = truncateNumberInput(e.target.value);
    const priceWei = price ? Web3.utils.toWei(price) : "0";
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
    const feePercent = (parseFloat(Web3.utils.fromWei(feePerToken)) * 100) / 1;
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
            <b>{truncateNumberOutput(Web3.utils.fromWei(this.state.fee))} {this.props.quote.symbol}</b>
          </small>
          <small className="total">
            Total: <b>{truncateNumberOutput(Web3.utils.fromWei(this.state.amountMinusFee))} {this.props.quote.symbol}</b>
          </small>
        </div>
      )
    } else {
      return (
        <div className="fee-and-total">
          <small className="fee">
            Fee ({this.calculateFeePercent()}%):{" "}
            <b>{truncateNumberOutput(Web3.utils.fromWei(this.state.fee))} {this.props.base.symbol}</b>
          </small>
          <small className="total">
            Total: <b>{truncateNumberOutput(Web3.utils.fromWei(this.state.totalMinusFee))} {this.props.base.symbol}</b>
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
            onChange={this.onAmountChange}
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
            onChange={this.onPriceChange}
          />
          <div className="input-group-append">
            <div className="input-group-text">{this.props.base.symbol}</div>
          </div>
        </div>
        <div className={`invalid-feedback ${this.state.error ? 'visible' : ''}`}>{this.state.error}</div>
      </div>
    );
  };

  submit = () => {
    if (!this.state.amountWei) {
      this.setState({ error: "Amount cannot be empty." });
      return;
    };
    if (!this.state.priceWei) {
      this.setState({ error: "Price cannot be empty." });
      return;
    };
    if (this.state.currentTab === 'buy') {
      if (Web3.utils.toBN(this.state.total).lt(Web3.utils.toBN(this.props.makerMinimum))) {
        this.setState({ error: `Minimum order is ${Web3.utils.fromWei(this.props.makerMinimum)} ${this.props.base.symbol}.` });
        return;
      }
      if (Web3.utils.toBN(this.state.total).gt(Web3.utils.toBN(this.props.base.balance))) {
        this.setState({ error: 'Not enough balance.' });
        return;
      }
    } else {
      if (Web3.utils.toBN(this.state.total).lt(Web3.utils.toBN(this.props.takerMinimum))) {
        this.setState({ error: `Minimum order is ${Web3.utils.fromWei(this.props.takerMinimum)} ${this.props.base.symbol}.` });
        return;
      }
      if (Web3.utils.toBN(this.state.amountWei).gt(Web3.utils.toBN(this.props.quote.balance))) {
        this.setState({ error: 'Not enough balance.' });
        return;
      }
    }

    console.log('SUBMIT')
  };

  render() {
    return (
      <div className={`Trade card ${this.props.theme}`}>
        {this.renderNotLoggedInOverlay()}
        <TabMenu
          items={this.state.tabs}
          currentItem={this.state.currentTab}
          theme={this.props.theme}
          onChange={this.handleTabChange}
        />
        <div className="body">
          {this.renderBalance()}

          {this.renderAmountAndPrice()}

          {this.renderFeeAndTotal()}

          <div className="submit">
            <Button theme={this.props.theme} fullWidth={true} onClick={this.submit}>
              {this.state.currentTab}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

// const mapStateToProps = state => {
//   return state;
// };

// const mapActionsToProps = {
//  getTradeData
// };

Trade.propTypes = {
  theme: PropTypes.string.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  base: PropTypes.object, // { symbol, balance }
  quote: PropTypes.object, // { symbol, balance }
  makerFee: PropTypes.string.isRequired,
  makerMinimum: PropTypes.string.isRequired,
  takerFee: PropTypes.string.isRequired,
  takerMinimum: PropTypes.string.isRequired
};

export default Trade;
