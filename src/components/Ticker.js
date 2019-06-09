import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./Ticker.scss";
import Search from "./Search";

const tickers = [
  {
    name: "ONE/ETH",
    price: "0.12345678",
    active: true
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
  renderTickers = () => {
    return tickers.map(t => {
      return (
        <div className={`ticker ${t.active ? "active" : ""}`}>
          <div className="name">{t.name}</div>
          <div className="price">{t.price}</div>
        </div>
      );
    });
  };

  render() {
    return (
      <div className={`Ticker ${this.props.theme}`}>
        <div className="search">
          <Search searchInputPlaceholder="Search..." theme={this.props.theme} />
        </div>
        <div className="tickers">{this.renderTickers()}</div>
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
