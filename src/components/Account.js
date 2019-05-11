import React, { Component } from "react";
import { connect } from "react-redux";

import Login from "./Login";
import TabMenu from "./TabMenu";
import SearchTable from "./SearchTable";
import "./Account.scss";
import {
  tokenFilter,
  transferShow,
  transferHandleAmountChange,
  transferHide,
  transferHandleSubmitAsync,
  transferEnterEntireBalance
} from "../actions";
import { extractKeysFromObjectArray, round } from "../helpers";
import ModalWrapper from "./ModalWrapper";
import TransferModal from "./TransferModal";
import TransferCompleteModal from "./TransferCompleteModal";
import singletons from "../singletons";

class Account extends Component {
  state = {
    tabs: ["assets", "orders", "transfers", "trades"],
    currentTab: "assets"
  };

  addActionsColumn = data => {
    for (let row of data) {
      const depositModalPayload = {
        type: "deposit",
        name: row.name,
        symbol: row.symbol
      };
      const withdrawModalPayload = {
        type: "withdraw",
        name: row.name,
        symbol: row.symbol
      };

      row["actions"] = (
        <div className="actions">
          <div
            className="action"
            onClick={() => this.props.transferShow(depositModalPayload)}
          >
            deposit
          </div>
          <div
            className="action"
            onClick={() => this.props.transferShow(withdrawModalPayload)}
          >
            withdraw
          </div>
        </div>
      );
    }
    return data;
  };

  getAssetTableData = () => {
    const { web3 } = singletons;

    if (!this.props.account.address) {
      return [];
    }
    const extractedData = extractKeysFromObjectArray(
      this.props.tokens.filtered,
      ["name", "symbol", "totalBalance", "availableBalance", "inOrders"]
    );
    for (let row of extractedData) {
      row.availableBalance = web3.utils.fromWei(row.availableBalance);
      row.inOrders = web3.utils.fromWei(row.inOrders);
      row.totalBalance = web3.utils.fromWei(row.totalBalance);
    }
    const dataWithActionsColumn = this.addActionsColumn(extractedData);
    return dataWithActionsColumn;
  };

  handleTabChange = tab => {
    this.setState({ currentTab: tab });
  };

  renderAssetSearchTable = () => {
    return (
      <SearchTable
        theme={this.props.app.theme}
        data={this.getAssetTableData()}
        searchInputPlaceholder="Search by asset name or symbol..."
        defaultOrderBy="totalBalance"
        excludeFromSorting={["actions"]}
        searchValue={this.props.tokens.searchValue}
        handleSearch={this.props.tokenFilter}
      />
    );
  };

  renderOrderSearchTable = () => {
    return <div>ORDERS</div>;
  };

  renderTransferSearchTable = () => {
    return <div>TRANSFERS</div>;
  };

  renderTradeSearchTable = () => {
    return <div>TRADES</div>;
  };

  renderFrontModal = () => {
    const { web3 } = singletons;
    const tokenSymbol = this.props.transfer.symbol;
    const token = this.props.tokens.all.filter(
      t => t.symbol === tokenSymbol
    )[0];

    if (!web3 || !token) {
      return;
    }

    const oneEther = web3.utils.toBN(1000000000000000000);
    const oneHundred = web3.utils.toBN(100);
    const feePerEther = web3.utils.toBN(token.withdrawFee);
    const withdrawAmount = web3.utils.toBN(this.props.transfer.amountWei);
    const feeAmount = withdrawAmount.mul(feePerEther).div(oneEther);
    const feePercentage = feePerEther.mul(oneHundred).div(oneEther);
    const receivingAmount = withdrawAmount.sub(feeAmount);

    const feeAmountFormatted = round(web3.utils.fromWei(feeAmount)).toString();
    const feePercentageFormatted = feePercentage.toString();
    const receivingAmountFormatted = round(
      web3.utils.fromWei(receivingAmount)
    ).toString();

    return (
      <TransferModal
        theme={this.props.app.theme}
        onHide={this.props.transferHide}
        type={this.props.transfer.type}
        name={this.props.transfer.name}
        symbol={this.props.transfer.symbol}
        amount={this.props.transfer.amount}
        onAmountChange={this.props.transferHandleAmountChange}
        error={this.props.transfer.error}
        onSubmit={this.props.transferHandleSubmitAsync}
        pending={this.props.transfer.pending}
        enterEntireBalance={this.props.transferEnterEntireBalance}
        fee={feeAmountFormatted}
        feeInPercentage={feePercentageFormatted}
        receiving={receivingAmountFormatted}
      />
    );
  };

  renderBackModal = () => {
    return (
      <TransferCompleteModal
        theme={this.props.app.theme}
        onHide={this.props.transferHide}
        type={this.props.transfer.type}
      />
    );
  };

  render() {
    return (
      <div className={`Account ${this.props.app.theme}`}>
        <ModalWrapper
          theme={this.props.app.theme}
          show={this.props.transfer.show}
          onHide={this.props.transferHide}
          pending={this.props.transfer.pending}
          completed={this.props.transfer.completed}
          renderFrontModal={this.renderFrontModal}
          renderBackModal={this.renderBackModal}
        />

        <Login />

        <div className={`card ${this.props.app.theme}`}>
          <TabMenu
            items={this.state.tabs}
            currentItem={this.state.currentTab}
            theme={this.props.app.theme}
            onChange={this.handleTabChange}
          />

          {this.state.currentTab === "assets" && this.renderAssetSearchTable()}
          {this.state.currentTab === "orders" && this.renderOrderSearchTable()}
          {this.state.currentTab === "transfers" &&
            this.renderTransferSearchTable()}
          {this.state.currentTab === "trades" && this.renderTradeSearchTable()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ app, account, tokens, transfer }) => {
  return { app, account, tokens, transfer };
};

const mapActionsToProps = {
  tokenFilter,
  transferShow,
  transferHandleAmountChange,
  transferHide,
  transferHandleSubmitAsync,
  transferEnterEntireBalance
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(Account);
