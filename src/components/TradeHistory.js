import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./OrderBook.scss";
import Table from './Table'

class TradeHistory extends Component {
  render() {
    return (
      <div className={`OrderBook card ${this.props.theme}`}>
        <div className="header">
          <div className="left">
            Trade History
          </div>
        </div>
        <div className="body">
          <Table
            theme={this.props.theme}
            data={[]}
            dataName='trades'
            defaultOrderBy='date'
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
