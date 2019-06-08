import React, { Component } from "react";
import { connect } from "react-redux";

import Chart from "./Chart";
import MarketsTable from "./MarketsTable";
import Trade from "./Trade";
import MarketOrders from "./MarketOrders";
import BuyBook from "./BuyBook";
import SellBook from "./SellBook";
import TradeHistory from "./TradeHistory";
import "./Market.scss";

class Market extends Component {
  render() {
    return (
      <div className="Market">
        <div className="row">
          <div className="col-lg-8">
            <Chart theme={this.props.app.theme} />
          </div>
          <div className="col-lg-4">
            <MarketsTable theme={this.props.app.theme} />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-4">
            <Trade theme={this.props.app.theme} />
          </div>
          <div className="col-lg-8">
            <MarketOrders theme={this.props.app.theme} />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6">
            <BuyBook theme={this.props.app.theme} />
          </div>
          <div className="col-lg-6">
            <SellBook theme={this.props.app.theme} />
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <TradeHistory theme={this.props.app.theme} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ app }) => {
  return { app };
};

// const mapDispatchToProps = {
//  getChartData
// };

export default connect(mapStateToProps)(Market);
