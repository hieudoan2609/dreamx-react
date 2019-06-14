import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import Chart from "./Chart";
import Trade from "./Trade";
import MyOpenOrders from "./MyOpenOrders";
import BuyBook from "./BuyBook";
import SellBook from "./SellBook";
import TradeHistory from "./TradeHistory";
import "./Market.scss";
import {
  marketLoadAsync,
  tickersHandleSearchInput
} from "../actions";

class Market extends Component {
  componentDidMount = () => {
    console.log(this.props)
    this.redirectToDefaultMarketIfMarketSymbolInvalid();
    window.scrollTo(0, 0);
    // sync currentMarket on componentDidMount if url param is valid
    const currentMarket = this.props.match.params.marketSymbol;
    if (currentMarket) {
      this.props.marketLoadAsync(currentMarket);
    }
  };

  componentDidUpdate = prevProps => {
    this.redirectToDefaultMarketIfMarketSymbolInvalid();
    // sync currentMarket on componentDidUpdate if url param is valid
    const currentMarket = this.props.match.params.marketSymbol;
    const previousMarket = prevProps.match.params.marketSymbol;
    const marketChanged = currentMarket !== previousMarket;
    if (marketChanged && currentMarket) {
      this.props.marketLoadAsync(currentMarket);
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
    
    if (!baseToken || !quoteToken) {
      return { base: undefined, quote: undefined };
    }

    const base = { symbol: baseToken.symbol, balance: baseToken.availableBalance, address: baseToken.address };
    const quote = { symbol: quoteToken.symbol, balance: quoteToken.availableBalance, address: quoteToken.address };
    return { base, quote };
  };

  render() {
    return (
      <div className="Market">
        <div className="row">
          <div className="col-lg-8">
            <Chart
              theme={this.props.app.theme}
              loading={this.props.market.loading}
              tickers={this.props.tickers.filtered}
              currentMarket={this.props.market.currentMarket}
              searchValue={this.props.tickers.searchValue}
              handleSearchInput={this.props.tickersHandleSearchInput}
            />
          </div>
          <div className="col-lg-4">
            <Trade
              theme={this.props.app.theme}
              loading={this.props.market.loading}
              loggedIn={this.props.account.address ? true : false}
              base={this.getBaseAndQuoteBalances().base}
              quote={this.getBaseAndQuoteBalances().quote}
              makerFee={this.props.app.makerFee}
              makerMinimum={this.props.app.makerMinimum}
              takerFee={this.props.app.takerFee}
              takerMinimum={this.props.app.takerMinimum}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <MyOpenOrders 
              theme={this.props.app.theme} 
              loading={this.props.market.loading}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-4">
            <BuyBook 
              theme={this.props.app.theme} 
              loading={this.props.market.loading}
            />
          </div>
          <div className="col-lg-4">
            <SellBook 
              theme={this.props.app.theme} 
              loading={this.props.market.loading}
            />
          </div>
          <div className="col-lg-4">
            <TradeHistory 
              theme={this.props.app.theme} 
              loading={this.props.market.loading}
            />
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
  marketLoadAsync,
  tickersHandleSearchInput
};

export default withRouter(
  connect(
    mapStateToProps,
    mapActionsToProps
  )(Market)
);
