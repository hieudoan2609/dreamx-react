import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./TradeHistory.scss";
import ScrollableTable from './ScrollableTable'
import Loading from './Loading'
import { truncateNumberOutput } from '../helpers'

class TradeHistory extends Component {
  extractTradesData = () => {
    if (!this.props.market || !this.props.quote) {
      return []
    }

    const quotePrecision = this.props.quote.amountPrecision
    const pricePrecision = this.props.market.pricePrecision
    const trades = this.props.marketTrades.all.map(t => {
      const price = <span className={t.type}>{truncateNumberOutput(t.price, pricePrecision)}</span>
      const amount = truncateNumberOutput(t.amount, quotePrecision)
      const time = t.createdAt
      return { price, amount, time }
    })
    return trades
  }

  render() {
    return (
      <div className={`TradeHistory card ${this.props.theme}`}>
        <Loading
          active={this.props.loading}
          type="absolute"
          theme={this.props.theme}
        />
        <div className="header">
          <div className="left">
            Trade History
          </div>
        </div>
        <div className="body">
          <ScrollableTable
            theme={this.props.theme}
            data={this.extractTradesData()}
            dataName='trades'
            defaultOrderBy='time'
            height={500}
            manuallySortable={false}
            dateColumn='time'
            dateFormat='HH:mm:ss'
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

// const mapActionsToProps = {
//  getTradeHistoryData
// };

TradeHistory.propTypes = {
  theme: PropTypes.string.isRequired
};

export default connect(mapStateToProps)(TradeHistory);
