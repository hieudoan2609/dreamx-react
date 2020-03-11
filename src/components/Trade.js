import axios from "axios";
import React, { Component } from "react";
import * as Web3Utils from "web3-utils";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import engine from 'dreamx-match-engine'

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

  resetState = () => {
    this.setState(INITIAL_STATE)
    this.state.TabMenu.updateHighlighter('buy')
  }

  componentDidMount = () => {
    this.props.registerTradeComponent(this)
  }

  componentWillUnmount = () => {
    this.props.registerTradeComponent(undefined)
  }

  registerTabMenuComponent = (TabMenu) => {
    this.setState({ TabMenu })
  }

  handleTabChange = tab => {
    const { price, priceWei, amount, amountWei, fee, total, feedback, totalMinusFee, amountMinusFee } = INITIAL_STATE
    const currentTab = this.state.currentTab
    if (tab !== currentTab) {
      this.setState({ currentTab: tab, price, priceWei, amount, amountWei, fee, total, feedback, totalMinusFee, amountMinusFee });
    }
  };

  renderNotLoggedInOverlay = () => {
    if (!this.props.loggedIn) {
      return <div className="not-logged-in">Please log in to trade.</div>;
    }
  };

  renderBalance = () => {
    if (!this.props.base || !this.props.quote) {
      return
    }

    let balance, symbol, precision;
    if (this.state.currentTab === "buy") {
      [balance, symbol, precision] = [this.props.base.balance, this.props.base.symbol, this.props.base.amountPrecision];
    } else {
      [balance, symbol, precision] = [this.props.quote.balance, this.props.quote.symbol, this.props.quote.amountPrecision];
    }

    return (
      <div className="balance">
        <div className="header">BALANCE</div>
        <div className="value">
          {truncateNumberOutput(Web3Utils.fromWei(balance.toString()), precision)} {symbol}
        </div>
      </div>
    );
  };

  calculateFeeAndTotal = (amountWei, priceWei) => {
    const { currentTab } = this.state;
    let { takerFee } = this.props;
    const oneEther = Web3Utils.toBN(1000000000000000000);

    let total, fee, totalMinusFee, amountMinusFee;
    if (amountWei && amountWei !== "0" && priceWei && priceWei !== "0") {
      [ amountWei, priceWei, takerFee ] = [ Web3Utils.toBN(amountWei), Web3Utils.toBN(priceWei), Web3Utils.toBN(takerFee) ];
      total = priceWei.mul(amountWei).div(oneEther);
      fee = currentTab === "buy" ? amountWei.mul(takerFee).div(oneEther) : total.mul(takerFee).div(oneEther);
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
    const amount = truncateNumberInput(value, 12, this.props.quote.amountPrecision);
    const amountWei = amount ? Web3Utils.toWei(amount) : "0";
    const { total, fee, totalMinusFee, amountMinusFee } = this.calculateFeeAndTotal( amountWei, priceWei );
    this.setState({ amount, amountWei, total, fee, totalMinusFee, amountMinusFee });
  };

  onPriceChange = value => {
    const { amountWei } = this.state;
    const { market } = this.props
    const price = truncateNumberInput(value, 12, market.pricePrecision);
    const priceWei = price ? Web3Utils.toWei(price) : "0";
    const { total, fee, totalMinusFee, amountMinusFee } = this.calculateFeeAndTotal( amountWei, priceWei );
    this.setState({ price, priceWei, total, fee, totalMinusFee, amountMinusFee });
  };

  setTabAndPrice = (tab, price) => {
    const { amountWei } = this.state;
    const priceWei = price ? Web3Utils.toWei(price) : "0"
    const { total, fee, totalMinusFee, amountMinusFee } = this.calculateFeeAndTotal( amountWei, priceWei );
    this.state.TabMenu.updateHighlighter(tab)
    this.setState({ currentTab: tab, price, priceWei, total, fee, totalMinusFee, amountMinusFee });
  }

  calculateTakerFeePercentage = () => {
    const feePercent = parseInt(this.props.takerFee) / 1000000000000000000 * 100
    return feePercent.toString();
  };

  renderFeeAndTotal = () => {
    if (!this.props.base || !this.props.quote) {
      return;
    }

    const baseToken = this.props.base
    const quoteToken = this.props.quote
    const sell = this.state.currentTab === 'sell'
    const feeToken = sell ? baseToken : quoteToken

    return (
      <div className="fee-and-total">
        <small className="fee">
          Fee ({this.calculateTakerFeePercentage()}%):{" "}
          <b>{truncateNumberOutput(Web3Utils.fromWei(this.state.fee), feeToken.amountPrecision)} {feeToken.symbol}</b>
        </small>
        <small className="total">
          Total: <b>{truncateNumberOutput(Web3Utils.fromWei(this.state.total), baseToken.amountPrecision)} {baseToken.symbol}</b>
        </small>
      </div>
    )
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
    const { makerMinimum, takerMinimum } = this.props

    this.setState({ feedback: {}, pending: true })

    if (!this.state.amountWei) {
      this.setState({ feedback: { type: 'error', message: 'Amount cannot be empty.' }, pending: false });
      return;
    };
    if (!this.state.priceWei) {
      this.setState({ feedback: { type: 'error', message: 'Price cannot be empty.' }, pending: false });
      return;
    };
    if (Web3Utils.toBN(this.state.total).lt(Web3Utils.toBN(this.props.makerMinimum))) {
      this.setState({ feedback: { type: 'error', message: `Minimum order is ${Web3Utils.fromWei(this.props.makerMinimum)} ${this.props.base.symbol}.` }, pending: false });
      return;
    }
    if (this.state.currentTab === 'buy') {
      if (Web3Utils.toBN(this.state.total).gt(Web3Utils.toBN(this.props.base.balance))) {
        this.setState({ feedback: { type: 'error', message: 'Not enough balance.' }, pending: false });
        return;
      }
    } else {
      if (Web3Utils.toBN(this.state.amountWei).gt(Web3Utils.toBN(this.props.quote.balance))) {
        this.setState({ feedback: { type: 'error', message: 'Not enough balance.' }, pending: false });
        return;
      }
    }

    const order = this.generateOrderFromInput()
    const matchedResults = engine.match({ order, orderBook: this.props.orderBook, makerMinimum, takerMinimum })
    const payloads = await this.generatePayloadsAsync(matchedResults)

    if (!payloads) {
      this.setState({ pending: false })
      return;
    }

    await this.submitPayloadsAsync(payloads)
  };

  generatePayloadsAsync = async (matchedResults) => {
    const { web3 } = singletons;
    const { app, account } = this.props
    const contractAddress = app.contractAddress
    const accountAddress = account.address
    let nonce = Date.now()
    const expiryTimestampInMilliseconds = 33117212071000
    const batch = new web3.BatchRequest();
    const payloads = { orders: [], trades: [] }
    const unsignedPayloads = []
    // generate unsigned payloads
    matchedResults.orders.forEach((order) => {
      nonce++
      const { giveTokenAddress, giveAmount, takeTokenAddress, takeAmount } = order
      const hash = web3.utils.soliditySha3(contractAddress, accountAddress, giveTokenAddress, giveAmount, takeTokenAddress, takeAmount, nonce, expiryTimestampInMilliseconds);
      const payload = { account_address: accountAddress, give_token_address: giveTokenAddress, give_amount: giveAmount, take_token_address: takeTokenAddress, take_amount: takeAmount, nonce, expiry_timestamp_in_milliseconds: expiryTimestampInMilliseconds, order_hash: hash, signature: undefined }
      batch.add(web3.eth.personal.sign.request(hash, accountAddress, undefined, function() {return}))
      unsignedPayloads.push(payload)
    })
    matchedResults.trades.forEach((trade) => {
      nonce++
      const { orderHash, amount } = trade
      const hash = web3.utils.soliditySha3(contractAddress, orderHash, accountAddress, amount, nonce);
      const payload = { account_address: accountAddress, order_hash: orderHash, amount, nonce, trade_hash: hash, signature: undefined }
      batch.add(web3.eth.personal.sign.request(hash, accountAddress, undefined, function() {return}))
      unsignedPayloads.push(payload)
    })
    // request signatures
    let signatures;
    try {
      signatures = (await batch.execute()).response
    } catch (err) {
      return
    }
    // update unsigned payloads with signatures
    let hasUnsignedPayload = false
    unsignedPayloads.forEach((payload, index) => {
      if (!signatures[index]) {
        hasUnsignedPayload = true
        return
      }

      payload.signature = signatures[index]

      if (payload.trade_hash) {
        payloads.trades.push(payload)
      } else {
        payloads.orders.push(payload)
      }
    })
    if (hasUnsignedPayload) {
      return
    } else {
      return payloads
    }
  }

  submitPayloadsAsync = async (payloads) => {
    const { API_HTTP_ROOT } = config;
    const { price, priceWei, amount, amountWei, fee, total, totalMinusFee, amountMinusFee } = INITIAL_STATE
    const hasOrderPayloads = payloads.orders.length > 0
    const hasTradePayloads = payloads.trades.length > 0
    try {
      if (hasOrderPayloads) {
        const payload = payloads.orders[0]
        await axios.post(`${API_HTTP_ROOT}/orders`, payload);
      }
      if (hasTradePayloads) {
        const payload = payloads.trades
        await axios.post(`${API_HTTP_ROOT}/trades`, payload);
      }
      const feedback = { type: 'success', message: 'Your order has been submitted.' }
      this.setState({ pending: false, price, priceWei, amount, amountWei, fee, total, totalMinusFee, amountMinusFee, feedback })
    } catch (err) {
      console.log(err.response)
      let feedback
      if (err.toString() === "Error: Request failed with status code 503") {
        feedback = { type: 'error', message: 'Service is unvailable, please try again later.' }
      } else {
        feedback = { type: 'error', message: 'There was an error, please try again later.' }
      }
      this.setState({ pending: false, feedback })
    }
  }

  generateOrderFromInput = () => {
    const type = this.state.currentTab
    let giveTokenAddress, giveAmount, takeTokenAddress, takeAmount
    if (type === 'buy') {
      giveTokenAddress = this.props.base.address
      giveAmount = this.state.total
      takeTokenAddress = this.props.quote.address
      takeAmount = this.state.amountWei
    } else {
      giveTokenAddress = this.props.quote.address
      giveAmount = this.state.amountWei
      takeTokenAddress = this.props.base.address
      takeAmount = this.state.total
    }
    const order = { giveTokenAddress, giveAmount, takeTokenAddress, takeAmount, type }
    return order
  }

  render() {
    return (
      <div className={`Trade card ${this.props.theme}`} ref={this.props.tradeRef}>
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
          registerComponent={this.registerTabMenuComponent}
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
  takerFee: PropTypes.string.isRequired,
  makerFee: PropTypes.string.isRequired,
  makerMinimum: PropTypes.string.isRequired,
  takerMinimum: PropTypes.string.isRequired,
  registerTradeComponent: PropTypes.func.isRequired,
  tradeRef: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(Trade);
