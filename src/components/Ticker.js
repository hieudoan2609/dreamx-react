import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./Ticker.scss";
import Search from "./Search";

const tickers = [
  {
    name: "ONE/ETH",
    price: "0.12345678"
  },
  {
    name: "TWO/ETH",
    price: "0.12345678"
  },
  {
    name: "THREE/ETH",
    price: "0.12345678"
  },
  {
    name: "FOUR/ETH",
    price: "0.12345678"
  },
  {
    name: "FIVE/ETH",
    price: "0.12345678"
  },
  {
    name: "SIX/ETH",
    price: "0.12345678"
  },
  {
    name: "SEVEN/ETH",
    price: "0.12345678"
  },
  {
    name: "EIGHT/ETH",
    price: "0.12345678"
  },
  {
    name: "NINE/ETH",
    price: "0.12345678"
  },
  {
    name: "TEN/ETH",
    price: "0.12345678"
  }
];

class Ticker extends Component {
  render() {
    return (
      <div className={`Ticker ${this.props.theme}`}>
        <div className="search">
          <Search searchInputPlaceholder="Search..." theme={this.props.theme} />
        </div>
        <div className="tickers">Tickers</div>
      </div>
    );
  }
}

// const mapStateToProps = ({ chart }) => {
//  return { chart };
// };

// const mapActionsToProps = {
//  getChartData
// };

Ticker.propTypes = {
  theme: PropTypes.string.isRequired
};

export default Ticker;
