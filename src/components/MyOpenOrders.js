import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./MyOpenOrders.scss";
import Table from "./Table";
import {
  capitalize
} from "../helpers";

class MyOpenOrders extends Component {
  extractOpenOrdersData = () => {
    if (!this.props.account.address) {
      return [];
    }

    const { accountOrders, market } = this.props;

    const extractedData = []
    for (let accountOrder of accountOrders.all) {
      if (accountOrder.marketSymbol !== market.currentMarket) {
        continue
      }

      const { price, amount, filled } = accountOrder;
      const type = (
        <div className={`pill ${accountOrder.type}`}>
          {capitalize(accountOrder.type)}
        </div>
      );
      const total = `${accountOrder.total} ETH`;
      const date = accountOrder.createdAt;
      const cancelAll = (
        <div className="actions">
          <div className="action">cancel</div>
        </div>
      );

      extractedData.push({ type, price, amount, total, filled, date, cancelAll });
    }

    return extractedData;
  };

  handleCancelAll = () => {
    console.log("CANCEL ALL");
  };

  render() {
    return (
      <div className={`MyOpenOrders card ${this.props.theme}`}>
        <div className="header">
          My Open Orders
        </div>
        <div className="body">
          <Table
            loginRequired={true}
            loggedIn={this.props.account.address ? true : false}
            theme={this.props.theme}
            data={this.extractOpenOrdersData()}
            defaultOrderBy='date'
            dateColumn="date"
            dataName='open orders'
            excludeFromSorting={["cancelAll"]}
            clickableHeaders={[
              { name: "cancelAll", onClick: this.handleCancelAll }
            ]}
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
//  getMyOpenOrdersData
// };

MyOpenOrders.propTypes = {
  theme: PropTypes.string.isRequired
};

export default connect(mapStateToProps)(MyOpenOrders);
