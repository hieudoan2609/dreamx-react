import React, { Component } from "react";
import { connect } from "react-redux";
import Web3 from "web3";

import Login from "./Login";
import TabMenu from "./TabMenu";
import Search from "./Search";
import Table from "./Table";
import "./Account.scss";
import {
  tokensHandleSearchInput,
  transferShow,
  transferHandleAmountChange,
  transferHide,
  transferHandleSubmitAsync,
  transferEnterEntireBalance,
  transfersHandleSearchInput
} from "../actions";
import {
  extractKeysFromObject,
  truncateNumberOutput,
  capitalize,
  getEtherscanTransaction
} from "../helpers";
import ModalWrapper from "./ModalWrapper";
import TransferModal from "./TransferModal";
import TransferCompleteModal from "./TransferCompleteModal";
import singletons from "../singletons";

class Account extends Component {
  state = {
    tabs: ["assets", "transfers", "orders", "trades"],
    currentTab: "assets",
    paginated: true,
    perPage: 15,
    tableHeight: 780
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

  extractTokensData = () => {
    if (!this.props.account.address) {
      return [];
    }

    const { web3 } = singletons;

    const extractedData = this.props.tokens.filtered.map(t =>
      extractKeysFromObject(t, [
        "name",
        "symbol",
        "totalBalance",
        "availableBalance",
        "inOrders"
      ])
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

  renderAssetTable = () => {
    return (
      <Table
        theme={this.props.app.theme}
        data={this.extractTokensData()}
        defaultOrderBy="totalBalance"
        excludeFromSorting={["actions"]}
        searchable={true}
        searchValue={this.props.tokens.searchValue}
        dataName="assets"
        paginated={this.state.paginated}
        perPage={this.state.perPage}
        height={this.state.tableHeight}
      />
    );
  };

  extractTransfersData = () => {
    if (!this.props.account.address) {
      return [];
    }

    const { tokens } = this.props;
    const extractedData = this.props.transfers.filtered.map(transfer => {
      const token = tokens.all.filter(
        t => t.address === transfer.tokenAddress
      )[0];
      const status = transfer.blockNumber ? "Completed" : "Pending";
      const coin = token.symbol;
      const amount = truncateNumberOutput(Web3.utils.fromWei(transfer.amount));
      const date = transfer.createdAt;
      const transactionHash = (
        <a
          href={getEtherscanTransaction(
            transfer.transactionHash,
            this.props.app.networkName
          )}
          target="_blank"
          rel="noopener noreferrer"
        >{`${transfer.transactionHash.substring(0, 10)}...`}</a>
      );
      const type = (
        <div className={`transfer-type ${transfer.type}`}>
          {capitalize(transfer.type)}
        </div>
      );
      return { type, coin, amount, transactionHash, status, date };
    });
    return extractedData;
  };

  renderTransferTable = () => {
    return (
      <Table
        theme={this.props.app.theme}
        data={this.extractTransfersData()}
        defaultOrderBy="date"
        searchable={true}
        searchValue={this.props.transfers.searchValue}
        excludeFromSorting={["transactionHash", "status"]}
        dateColumn="date"
        dataName="transfers"
        paginated={this.state.paginated}
        perPage={this.state.perPage}
        height={this.state.tableHeight}
      />
    );
  };

  renderOrderTable = () => {
    return <div>ORDERS</div>;
  };

  renderTradeTable = () => {
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

    const feeAmountFormatted = truncateNumberOutput(
      web3.utils.fromWei(feeAmount)
    );
    const feePercentageFormatted = truncateNumberOutput(feePercentage);
    const receivingAmountFormatted = truncateNumberOutput(
      web3.utils.fromWei(receivingAmount)
    );

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

  renderSearchBox = () => {
    let searchValue, handleSearchInput;
    if (this.state.currentTab === "assets") {
      searchValue = this.props.tokens.searchValue;
      handleSearchInput = this.props.tokensHandleSearchInput;
    } else if (this.state.currentTab === "transfers") {
      searchValue = this.props.transfers.searchValue;
      handleSearchInput = this.props.transfersHandleSearchInput;
    }
    return (
      <Search
        searchInputPlaceholder="Search by asset name or symbol..."
        searchValue={searchValue}
        handleSearchInput={handleSearchInput}
        theme={this.props.app.theme}
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

          {this.renderSearchBox()}

          {this.state.currentTab === "assets" && this.renderAssetTable()}
          {this.state.currentTab === "orders" && this.renderOrderTable()}
          {this.state.currentTab === "transfers" && this.renderTransferTable()}
          {this.state.currentTab === "trades" && this.renderTradeTable()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ app, account, tokens, transfer, transfers }) => {
  return { app, account, tokens, transfer, transfers };
};

const mapActionsToProps = {
  tokensHandleSearchInput,
  transferShow,
  transferHandleAmountChange,
  transferHide,
  transferHandleSubmitAsync,
  transferEnterEntireBalance,
  transfersHandleSearchInput
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(Account);
