import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import Chart from "./Chart";
import Trade from "./Trade";
import MyOpenOrders from "./MyOpenOrders";
import OrderBook from "./OrderBook";
import TradeHistory from "./TradeHistory";
import "./Market.scss";
import {
  marketLoadAsync,
  tickersHandleSearchInput
} from "../actions";

class Market extends Component {
  componentDidMount = () => {
    this.redirectToDefaultMarketIfMarketSymbolInvalid();
    window.scrollTo(0, 0);
  };

  componentDidUpdate = prevProps => {
    this.redirectToDefaultMarketIfMarketSymbolInvalid();
    window.redirectToDefaultMarketIfMarketSymbolInvalid = this.redirectToDefaultMarketIfMarketSymbolInvalid
    const currentMarket = this.props.match.params.marketSymbol;
    const previousMarket = prevProps.match.params.marketSymbol;
    const existingMarket = this.props.market.currentMarket;
    const marketChanged = currentMarket !== previousMarket && currentMarket !== existingMarket;
    const appLoaded = !this.props.app.loading
    if (marketChanged && appLoaded) {
      this.props.marketLoadAsync();
      window.scrollTo(0, 0);
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
    const isLoading = this.props.market.loading || this.props.app.loading || this.props.account.loading

    return (
      <div className="Market">
        <div className="row">
          <div className="col-lg-8">
            <Chart
              theme={this.props.app.theme}
              loading={isLoading}
              tickers={this.props.tickers.filtered}
              currentMarket={this.props.market.currentMarket}
              searchValue={this.props.tickers.searchValue}
              handleSearchInput={this.props.tickersHandleSearchInput}
            />
          </div>
          <div className="col-lg-4">
            <Trade
              theme={this.props.app.theme}
              loading={isLoading}
              loggedIn={this.props.account.address ? true : false}
              base={this.getBaseAndQuoteBalances().base}
              quote={this.getBaseAndQuoteBalances().quote}
              makerFee={this.props.app.makerFee}
              makerMinimum={this.props.app.makerMinimum}
              onRef={ref => (this.trade = ref)}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <MyOpenOrders 
              theme={this.props.app.theme} 
              loading={isLoading}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-4">
            <OrderBook 
              theme={this.props.app.theme} 
              loading={isLoading}
              type='buy'
              total={this.props.orderBook.totalBuy}
              bookData={this.props.orderBook.buyBook}
              base={this.getBaseAndQuoteBalances().base}
              quote={this.getBaseAndQuoteBalances().quote}
              trade={this.trade}
            />
          </div>
          <div className="col-lg-4">
            <OrderBook 
              theme={this.props.app.theme} 
              loading={isLoading}
              type='sell'
              total={this.props.orderBook.totalSell}
              bookData={this.props.orderBook.sellBook}
              base={this.getBaseAndQuoteBalances().base}
              quote={this.getBaseAndQuoteBalances().quote}
              trade={this.trade}
            />
          </div>
          <div className="col-lg-4">
            <TradeHistory 
              theme={this.props.app.theme} 
              loading={isLoading}
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
