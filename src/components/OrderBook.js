import * as Web3Utils from 'web3-utils'
import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

import Loading from './Loading'
import { extractBookData, truncateNumberOutput, capitalize } from '../helpers'
import ScrollableTable from './ScrollableTable'
import "./OrderBook.scss";

class OrderBook extends Component {
  renderTotal = () => {
    if (this.props.bookData.length === 0 || !this.props.base || !this.props.quote) {
      return
    }

    const decimalPoints = 2
    const total = truncateNumberOutput(Web3Utils.fromWei(this.props.total), decimalPoints)
    return (
      <div className="right">
        Total: {total} {this.props.quote.symbol}
      </div>
    )
  }

  onRowClick = (row) => {
    const offset = 80;
    const currentScrolled = window.pageYOffset;
    const tradeTop = this.props.tradeRef.current.getBoundingClientRect().top + currentScrolled - offset;
    if (this.props.Trade) {
      const tab = this.props.type === 'buy' ? 'sell' : 'buy'
      const price = row.price
      this.props.Trade.setTabAndPrice(tab, price)
      window.scrollTo(0, tradeTop)
    }
  }

  render() {
    const order = this.props.type === 'buy' ? 'desc' : 'asc'

    return (
      <div className={`OrderBook card ${this.props.theme} ${this.props.type}`}>
        <Loading
          active={this.props.loading}
          type="absolute"
          theme={this.props.theme}
        />
        <div className="head">
          <div className="left">
            {capitalize(this.props.type)} Orders
          </div>
          <div className="right">
            {this.renderTotal()}
          </div>
        </div>
        <div className="body">
          <ScrollableTable
            theme={this.props.theme}
            data={extractBookData(this.props.bookData)}
            dataName={`${this.props.type} orders`}
            defaultOrderBy='price'
            defaultOrder={order}
            manuallySortable={false}
            height={500}
            onRowClick={this.onRowClick}
          />
        </div>
      </div>
    );
  }
}

// const mapStateToProps = (state) => {
//  return state;
// };

// const mapActionsToProps = {};

OrderBook.propTypes = {
  theme: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired, // 'sell', 'buy'
  total: PropTypes.string.isRequired,
  bookData: PropTypes.array.isRequired, // [ { price, amount, total }, ... ]
  loading: PropTypes.bool.isRequired,
  base: PropTypes.object, // { symbol, balance, address }
  quote: PropTypes.object, // { symbol, balance, address }
  Trade: PropTypes.object // ref to Trade component
};

export default OrderBook;
