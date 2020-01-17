import * as Web3Utils from 'web3-utils'
import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Loading from './Loading'
import { extractBookData, truncateNumberOutput, capitalize } from '../helpers'
import ScrollableTable from './ScrollableTable'
import "./OrderBook.scss";

class OrderBook extends Component {
  renderTotal = () => {
    if (this.props.bookData.length === 0 || !this.props.quote) {
      return
    }

    const precision = this.props.quote.amountPrecision
    const total = truncateNumberOutput(Web3Utils.fromWei(this.props.total.toString()), precision)
    return (
      <div className="right">
        Total: {total} {this.props.quote.symbol}
      </div>
    )
  }

  renderOffers = () => {
    const order = this.props.type === 'buy' ? 'desc' : 'asc'

    let data;
    if (!this.props.quote || !this.props.base || !this.props.market) {
      data = []
    } else {
      const basePrecision = this.props.base.amountPrecision
      const quotePrecision = this.props.quote.amountPrecision
      const pricePrecision = this.props.market.pricePrecision
      data = extractBookData(this.props.bookData, basePrecision, quotePrecision, pricePrecision)
    }
    
    return (
      <ScrollableTable
        theme={this.props.theme}
        data={data}
        dataName={`${this.props.type} orders`}
        defaultOrderBy='price'
        defaultOrder={order}
        manuallySortable={false}
        height={500}
        onRowClick={this.onRowClick}
      />
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
          {this.renderOffers()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
 return state;
};

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

export default connect(mapStateToProps)(OrderBook);
