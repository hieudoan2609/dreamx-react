import React, { Component } from "react";
import { connect } from "react-redux";
import * as Web3Utils from "web3-utils";

import Login from "./Login";
import TabMenu from "./TabMenu";
import Search from "./Search";
import "./Account.scss";
import {
  transferShow,
  transferHandleAmountChange,
  transferHide,
  transferHandleSubmitAsync,
  transferEnterEntireBalance,
  tokensHandleSearchInput,
  tokensClearSearch,
  transfersHandleSearchInput,
  transfersClearSearch,
  accountOrdersHandleSearchInput,
  accountOrdersClearSearch,
  accountTradesHandleSearchInput,
  accountTradesClearSearch,
  accountOrdersCancelAsync,
  accountOrdersCancelAllAsync
} from "../actions";
import {
  extractKeysFromObject,
  truncateNumberOutput,
  capitalize,
  getEtherscanTransaction
} from "../helpers";
import ModalWrapper from "./ModalWrapper";
import Loading from "./Loading";
import TransferModal from "./TransferModal";
import TransferCompleteModal from "./TransferCompleteModal";
import PaginatedTable from "./PaginatedTable";
import singletons from "../singletons";

class Account extends Component {
  componentDidMount = () => {
    window.scrollTo(0, 0);
  };

  state = {
    tabs: ["assets", "transfers", "orders", "trades"],
    currentTab: "assets",
    paginated: true,
    perPage: 15,
    tableHeight: 768
  };

  extractAssetsData = () => {
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
      row.availableBalance = web3.utils.fromWei(row.availableBalance);
      row.inOrders = web3.utils.fromWei(row.inOrders);
      row.totalBalance = web3.utils.fromWei(row.totalBalance);
      row.actions = (
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
    return extractedData;
  };

  handleTabChange = tab => {
    this.setState({ currentTab: tab });
  };

  extractTransfersData = () => {
    if (!this.props.account.address) {
      return [];
    }

    const { tokens, transfers } = this.props;
    const extractedData = transfers.filtered.map(transfer => {
      const token = tokens.all.filter(
        t => t.address === transfer.tokenAddress
      )[0];
      const status = transfer.blockNumber ? "Completed" : "Pending";
      const coin = token.symbol;
      const amount = truncateNumberOutput(Web3Utils.fromWei(transfer.amount));
      const date = transfer.createdAt;

      let transactionHash;
      if (transfer.transactionHash) {
        transactionHash = (
          <a
            href={getEtherscanTransaction(
              transfer.transactionHash,
              this.props.app.networkName
            )}
            target="_blank"
            rel="noopener noreferrer"
          >{`${transfer.transactionHash.substring(0, 10)}...`}</a>
        );
      } else {
        transactionHash = "Pending";
      }

      const type = (
        <div className={`pill ${transfer.type}`}>
          {capitalize(transfer.type)}
        </div>
      );
      return { type, coin, amount, transactionHash, status, date };
    });
    return extractedData;
  };

  renderTransfersTable = () => {
    return (
      <PaginatedTable
        loginRequired={true}
        loggedIn={this.props.account.address ? true : false}
        theme={this.props.app.theme}
        data={this.extractTransfersData()}
        defaultOrderBy="date"
        searchable={true}
        searchValue={this.props.transfers.searchValue}
        dateColumn="date"
        dataName="transfers"
        paginated={this.state.paginated}
        perPage={this.state.perPage}
        height={this.state.tableHeight}
        clearSearch={this.props.transfersClearSearch}
      />
    );
  };

  renderAssetsTable = () => {
    return (
      <PaginatedTable
        loginRequired={true}
        loggedIn={this.props.account.address ? true : false}
        theme={this.props.app.theme}
        data={this.extractAssetsData()}
        defaultOrderBy="totalBalance"
        excludeFromSorting={["actions"]}
        searchable={true}
        searchValue={this.props.tokens.searchValue}
        dataName="assets"
        paginated={this.state.paginated}
        perPage={this.state.perPage}
        height={this.state.tableHeight}
        clearSearch={this.props.tokensClearSearch}
      />
    );
  };

  extractAccountOrdersData = () => {
    if (!this.props.account.address) {
      return [];
    }

    const { accountOrders } = this.props;

    const extractedData = accountOrders.filtered.map(accountOrder => {
      const type = (
        <div className={`pill ${accountOrder.type}`}>
          {capitalize(accountOrder.type)}
        </div>
      );
      const price = Web3Utils.fromWei(accountOrder.price)
      const amount = Web3Utils.fromWei(accountOrder.amount)
      const filled = Web3Utils.fromWei(accountOrder.filled)
      const total = `${Web3Utils.fromWei(accountOrder.total)} ETH`;
      const status = accountOrder.status === 'closed' ? "Closed" : "Open";
      const market = accountOrder.marketSymbolFormatted;
      const date = accountOrder.createdAt;
      const cancelAll = (
        <div className="actions">
          <div className={`action ${accountOrder.status === 'closed' ? 'disabled' : ''}`} onClick={() => this.props.accountOrdersCancelAsync(accountOrder)}>cancel</div>
        </div>
      );

      return {
        market,
        type,
        price,
        amount,
        total,
        filled,
        status,
        date,
        cancelAll
      };
    });

    return extractedData;
  };

  renderOrdersTable = () => {
    const hasOpenOrders = this.props.accountOrders.all.filter(o => o.status === 'open').length > 0

    return (
      <PaginatedTable
        loginRequired={true}
        loggedIn={this.props.account.address ? true : false}
        theme={this.props.app.theme}
        data={this.extractAccountOrdersData()}
        defaultOrderBy="date"
        excludeFromSorting={["cancelAll"]}
        searchable={true}
        searchValue={this.props.accountOrders.searchValue}
        dateColumn="date"
        dataName="orders"
        paginated={this.state.paginated}
        perPage={this.state.perPage}
        height={this.state.tableHeight}
        clearSearch={this.props.accountOrdersClearSearch}
        clickableHeaders={[
          { name: "cancelAll", onClick: this.props.accountOrdersCancelAllAsync, disabled: !hasOpenOrders }
        ]}
      />
    );
  };

  extractAccountTradesData = () => {
    if (!this.props.account.address) {
      return [];
    }

    const { accountTrades } = this.props;

    const extractedData = accountTrades.filtered.map(t => {
      const { price, amount } = t;
      const type = <div className={`pill ${t.type}`}>{capitalize(t.type)}</div>;
      const total = `${t.total} ETH`;
      const market = t.marketSymbolFormatted;
      const date = t.createdAt;
      const fee = `${truncateNumberOutput(t.fee)} ETH`;

      return {
        market,
        type,
        price,
        amount,
        fee,
        total,
        date
      };
    });

    return extractedData;
  };

  renderAccountTradesTable = () => {
    return (
      <PaginatedTable
        loginRequired={true}
        loggedIn={this.props.account.address ? true : false}
        theme={this.props.app.theme}
        data={this.extractAccountTradesData()}
        defaultOrderBy="date"
        searchable={true}
        searchValue={this.props.accountTrades.searchValue}
        dateColumn="date"
        dataName="trades"
        paginated={this.state.paginated}
        perPage={this.state.perPage}
        height={this.state.tableHeight}
        clearSearch={this.props.accountTradesClearSearch}
        clickableHeaders={[
          { name: "cancelAll", onClick: this.handleCancelAll }
        ]}
      />
    );
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
        success={this.props.transfer.success}
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
    } else if (this.state.currentTab === "orders") {
      searchValue = this.props.accountOrders.searchValue;
      handleSearchInput = this.props.accountOrdersHandleSearchInput;
    } else if (this.state.currentTab === "trades") {
      searchValue = this.props.accountTrades.searchValue;
      handleSearchInput = this.props.accountTradesHandleSearchInput;
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
    const isLoading = this.props.account.loading || this.props.app.loading

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

        <Login 
          loading={isLoading}
        />

        <div className={`card ${this.props.app.theme}`}>
          <Loading
            active={isLoading}
            type="absolute"
            theme={this.props.app.theme}
          />

          <TabMenu
            items={this.state.tabs}
            currentItem={this.state.currentTab}
            theme={this.props.app.theme}
            onChange={this.handleTabChange}
          />

          {this.renderSearchBox()}

          {this.state.currentTab === "assets" && this.renderAssetsTable()}
          {this.state.currentTab === "orders" && this.renderOrdersTable()}
          {this.state.currentTab === "transfers" && this.renderTransfersTable()}
          {this.state.currentTab === "trades" &&
            this.renderAccountTradesTable()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return state;
};

const mapActionsToProps = {
  transferShow,
  transferHandleAmountChange,
  transferHide,
  transferHandleSubmitAsync,
  transferEnterEntireBalance,
  tokensHandleSearchInput,
  tokensClearSearch,
  transfersHandleSearchInput,
  transfersClearSearch,
  accountOrdersHandleSearchInput,
  accountOrdersClearSearch,
  accountTradesHandleSearchInput,
  accountTradesClearSearch,
  accountOrdersCancelAsync,
  accountOrdersCancelAllAsync
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(Account);
