import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./OrderBook.scss";
import Table from './Table'

class BuyBook extends Component {
  extractBookData = () => {
    const extractedData = []
    const book = this.props.orderBook.buyBook
    const prices = {}

    for (let order of book) {
      console.log(order)
      // extractedData.push({ price, amount, total })
    }

    return extractedData
  }

  render() {
    return (
      <div className={`OrderBook card ${this.props.theme}`}>
        <div className="header">
          <div className="left">
            Buy Orders
          </div>
          <div className="right">
            Total: 1000000.00 QUOTE
          </div>
        </div>
        <div className="body">
          <Table
            theme={this.props.theme}
            data={this.extractBookData()}
            dataName='buy orders'
            defaultOrderBy='price'
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
//  getBuyBookData
// };

BuyBook.propTypes = {
  theme: PropTypes.string.isRequired
};

export default connect(mapStateToProps)(BuyBook);
