import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Web3 from "web3";

import Chart from "./Chart";
import Trade from "./Trade";
import MarketOrders from "./MarketOrders";
import BuyBook from "./BuyBook";
import SellBook from "./SellBook";
import TradeHistory from "./TradeHistory";
import "./Market.scss";
import {
  marketUpdateCurrentMarket,
  tickersHandleSearchInput
} from "../actions";
import { truncateNumberOutput } from "../helpers";

class Market extends Component {
  componentDidMount = () => {
    this.redirectToDefaultMarketIfMarketSymbolInvalid();
    window.scrollTo(0, 0);
    // sync currentMarket on componentDidMount if url param is valid
    const currentMarket = this.props.match.params.marketSymbol;
    if (currentMarket) {
      this.props.marketUpdateCurrentMarket(currentMarket);
    }
  };

  componentDidUpdate = prevProps => {
    this.redirectToDefaultMarketIfMarketSymbolInvalid();
    // sync currentMarket on componentDidUpdate if url param is valid
    const currentMarket = this.props.match.params.marketSymbol;
    const previousMarket = prevProps.match.params.marketSymbol;
    const marketChanged = currentMarket !== previousMarket;
    if (marketChanged && currentMarket) {
      this.props.marketUpdateCurrentMarket(currentMarket);
    }
  };

  redirectToDefaultMarketIfMarketSymbolInvalid = () => {
    const defaultTicker = this.props.tickers.all[0];
    const allMarkets = this.props.markets.all;

    if (!defaultTicker || allMarkets.length < 1) {
      return;
    }

    const currentMarket = this.props.match.params.marketSymbol;
    const defaultMarket = defaultTicker.marketSymbol;

    const currentMarketExists = allMarkets.filter(
      m => m.symbol === currentMarket
    )[0]
      ? true
      : false;

    if (!currentMarket || !currentMarketExists) {
      this.props.history.push(`/market/${defaultMarket}`);
      return;
    }
  };

  // returns { base: { symbol, balance }, quote: { symbol, balance } }
  getBaseAndQuoteBalances = () => {
    const [
      baseTokenSymbol,
      quoteTokenSymbol
    ] = this.props.market.currentMarket.split("_");
    const allTokens = this.props.tokens.all;

    if (!baseTokenSymbol || !quoteTokenSymbol || allTokens.length < 1) {
      return { base: undefined, quote: undefined };
    }

    const baseToken = this.props.tokens.all.filter(
      t => t.symbol === baseTokenSymbol
    )[0];
    const quoteToken = this.props.tokens.all.filter(
      t => t.symbol === quoteTokenSymbol
    )[0];
    const baseSymbol = baseToken.symbol;
    const quoteSymbol = quoteToken.symbol;
    const baseBalance = truncateNumberOutput(
      Web3.utils.fromWei(baseToken.availableBalance)
    );
    const quoteBalance = truncateNumberOutput(
      Web3.utils.fromWei(quoteToken.availableBalance)
    );
    const base = { symbol: baseSymbol, balance: baseBalance };
    const quote = { symbol: quoteSymbol, balance: quoteBalance };
    return { base, quote };
  };

  render() {
    return (
      <div className="Market">
        <div className="row">
          <div className="col-lg-8">
            <Chart
              theme={this.props.app.theme}
              tickers={this.props.tickers.filtered}
              currentMarket={this.props.market.currentMarket}
              searchValue={this.props.tickers.searchValue}
              handleSearchInput={this.props.tickersHandleSearchInput}
            />
          </div>
          <div className="col-lg-4">
            <Trade
              theme={this.props.app.theme}
              loggedIn={this.props.account.address ? true : false}
              base={this.getBaseAndQuoteBalances().base}
              quote={this.getBaseAndQuoteBalances().quote}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <MarketOrders theme={this.props.app.theme} />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-4">
            <BuyBook theme={this.props.app.theme} />
          </div>
          <div className="col-lg-4">
            <SellBook theme={this.props.app.theme} />
          </div>
          <div className="col-lg-4">
            <TradeHistory theme={this.props.app.theme} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return state;
};

const mapActionsToProps = {
  marketUpdateCurrentMarket,
  tickersHandleSearchInput
};

export default withRouter(
  connect(
    mapStateToProps,
    mapActionsToProps
  )(Market)
);
