import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./MyOpenOrders.scss";
import Table from "./Table";

class MyOpenOrders extends Component {
  // extractOpenOrdersData = () => {
  //   if (!this.props.account.address) {
  //     return [];
  //   }

  //   const { accountOrders } = this.props;

  //   const extractedData = accountOrders.filtered.map(accountOrder => {
  //     const { price, amount, filled } = accountOrder;
  //     const type = (
  //       <div className={`pill ${accountOrder.type}`}>
  //         {capitalize(accountOrder.type)}
  //       </div>
  //     );
  //     const total = `${accountOrder.total} ETH`;
  //     const status = capitalize(accountOrder.status);
  //     const market = accountOrder.marketSymbol;
  //     const date = accountOrder.createdAt;
  //     const cancelAll = (
  //       <div className="actions">
  //         <div className="action">cancel</div>
  //       </div>
  //     );

  //     return {
  //       market,
  //       type,
  //       price,
  //       amount,
  //       total,
  //       filled,
  //       status,
  //       date,
  //       cancelAll
  //     };
  //   });

  //   return extractedData;
  // };

  render() {
    return (
      <div className={`MyOpenOrders card ${this.props.theme}`}>
        <div className="header">
          My Open Orders
        </div>
        <div className="body">
          <Table
            theme={this.props.theme}
            dataName='open orders'
            data={[]}
            defaultOrderBy='date'
            loginRequired={true}
            loggedIn={this.props.account.address ? true : false}
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
