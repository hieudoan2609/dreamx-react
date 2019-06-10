import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

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

class Market extends Component {
  componentDidMount = () => {
    this.redirectIfNotValidMarket();
    window.scrollTo(0, 0);
    // sync currentMarket on componentDidMount if url param is valid
    const currentMarket = this.props.match.params.marketSymbol;
    if (currentMarket) {
      this.props.marketUpdateCurrentMarket(currentMarket);
    }
  };

  componentDidUpdate = prevProps => {
    this.redirectIfNotValidMarket();
    // sync currentMarket on componentDidUpdate if url param is valid
    const currentMarket = this.props.match.params.marketSymbol;
    const previousMarket = prevProps.match.params.marketSymbol;
    const marketChanged = currentMarket !== previousMarket;
    if (marketChanged && currentMarket) {
      this.props.marketUpdateCurrentMarket(currentMarket);
    }
  };

  redirectIfNotValidMarket = () => {
    const currentMarket = this.props.match.params.marketSymbol;
    const defaultTicker = this.props.tickers.all[0];
    if (!currentMarket && defaultTicker) {
      const defaultMarket = defaultTicker.marketSymbol;
      this.props.history.push(`/market/${defaultMarket}`);
    }
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
            <Trade theme={this.props.app.theme} />
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
