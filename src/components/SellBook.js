import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./OrderBook.scss";
import Table from './Table'
import Loading from './Loading'

class SellBook extends Component {
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
          <div className="right">
            Total: 1000000.00 QUOTE
          </div>
        </div>
        <div className="body">
          <Table
            theme={this.props.theme}
            data={[]}
            dataName='sell orders'
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
//  getSellBookData
// };

SellBook.propTypes = {
  theme: PropTypes.string.isRequired
};

export default connect(mapStateToProps)(SellBook);
