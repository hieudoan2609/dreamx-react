import React, { Component } from "react";
import { connect } from "react-redux";

import Chart from "./Chart";
import Trade from "./Trade";
import MarketOrders from "./MarketOrders";
import BuyBook from "./BuyBook";
import SellBook from "./SellBook";
import TradeHistory from "./TradeHistory";
import "./Market.scss";
import { changeMarket } from "../actions";

class Market extends Component {
  componentDidMount = () => {
    window.scrollTo(0, 0);
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
              changeMarket={this.props.changeMarket}
              searchValue={this.props.tickers.searchValue}
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
  changeMarket
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(Market);
