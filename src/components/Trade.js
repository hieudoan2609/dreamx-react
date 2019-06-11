import React, { Component } from "react";
import Web3 from "web3";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./Trade.scss";
import TabMenu from "./TabMenu";
import Button from "./Button";
import { truncateNumberInput } from "../helpers";

class Trade extends Component {
  state = {
    tabs: ["buy", "sell"],
    currentTab: "buy",
    price: "",
    amount: "",
    amountWei: "",
    fee: 0,
    total: 0,
    pending: false,
    error: "",
    totalMinusFee: 0,
    amountMinusFee: 0
  };

  handleTabChange = tab => {
    this.setState({ currentTab: tab });
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
          {balance} {symbol}
        </div>
      </div>
    );
  };

  onAmountChange = e => {
    const amount = e.target.value ? truncateNumberInput(e.target.value) : "";
    const amountWei = amount ? Web3.utils.toWei(amount) : "0";
    this.setState({ amount, amountWei });
  };

  onPriceChange = e => {
    const price = e.target.value ? truncateNumberInput(e.target.value) : "";
    this.setState({ price });
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

          <div className="amount-and-price">
            <input
              type="number"
              className={`form-control`}
              placeholder="Amount"
              spellCheck="false"
              value={this.state.amount}
              onChange={this.onAmountChange}
            />
            <input
              type="number"
              className={`form-control`}
              placeholder="Price"
              spellCheck="false"
              value={this.state.price}
              onChange={this.onPriceChange}
            />
            <div className="invalid-feedback">This is an error.</div>
          </div>

          <div className="fee-and-total">
            <small className="fee">
              Fee ({this.calculateFeePercent()}%): <b>0.12345678 ETH</b>
            </small>
            <small className="total">
              Total: <b>0.12345678 ETH</b>
            </small>
          </div>

          <div className="submit">
            <Button theme={this.props.theme} fullWidth={true}>
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
