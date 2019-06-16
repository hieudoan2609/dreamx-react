import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./TradeHistory.scss";
import ScrollableTable from './ScrollableTable'
import Loading from './Loading'

class TradeHistory extends Component {
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
            data={[]}
            dataName='trades'
            defaultOrderBy='date'
            height={500}
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
