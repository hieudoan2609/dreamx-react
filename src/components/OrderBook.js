import Web3 from 'web3'
import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

import Loading from './Loading'
import { extractBookData, truncateNumberOutput, capitalize } from '../helpers'

import "./OrderBook.scss";

class OrderBook extends Component {
  renderTotal = () => {
    if (!this.props.base || !this.props.quote) {
      return
    }

    const decimalPoints = 2
    const total = truncateNumberOutput(Web3.utils.fromWei(this.props.total), decimalPoints)
    return (
      <div className="right">
        Total: {total} {this.props.quote.symbol}
      </div>
    )
  }

  // renderTableHeader = () => {

  // }

  render() {
    const bookData = extractBookData(this.props.bookData)

    return (
      <div className={`OrderBook card ${this.props.theme}`}>
        <Loading
          active={this.props.loading}
          type="absolute"
          theme={this.props.theme}
        />
        <div className="head">
          <div className="left">
            {capitalize(this.props.type)} Orders
          </div>
          {this.renderTotal()}
        </div>
        <div className="body">
          <div className="table">
            <div className="thead">
              <div className="tr">
                <div className="th">price</div>
                <div className="th">amount</div>
                <div className="th">total</div>
              </div>
            </div>
            <div className="tbody">
              <div className="tr">
                <div className="td">11.23456789</div>
                <div className="td">1234567890.90</div>
                <div className="td">1234567890.90</div>
              </div>
            </div>
          </div>
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
  quote: PropTypes.object // { symbol, balance, address }
};

export default OrderBook;
