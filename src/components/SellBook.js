import Web3 from 'web3'
import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./OrderBook.scss";
import Table from './Table'
import { extractBookData, truncateNumberOutput } from '../helpers'
import Loading from './Loading'

class SellBook extends Component {
  renderTotal = () => {
    const decimalPoints = 2
    const total = truncateNumberOutput(Web3.utils.fromWei(this.props.orderBook.totalSell), decimalPoints)
    return (
      <div className="right">
        Total: {total} {this.props.market.quoteSymbol}
      </div>
    )
  }

  render() {
    return (
      <div className={`OrderBook card ${this.props.theme}`}>
        <Loading
          active={this.props.loading}
          type="absolute"
          theme={this.props.theme}
        />
        <div className="header">
          <div className="left">
            Sell Orders
          </div>
          {this.renderTotal()}
        </div>
        <div className="body">
          <Table
            theme={this.props.theme}
            data={extractBookData(this.props.orderBook.sellBook)}
            dataName='sell orders'
            defaultOrderBy='price'
            defaultOrder='asc'
            manuallySortable={false}
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
//  getSellBookData
// };

SellBook.propTypes = {
  theme: PropTypes.string.isRequired
};

export default connect(mapStateToProps)(SellBook);
