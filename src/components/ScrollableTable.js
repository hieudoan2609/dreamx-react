import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

// import "./ScrollableTable.scss";
import Table from "./Table";

class ScrollableTable extends Component {
  render() {
    return (
      <Table
        theme={this.props.theme}
        data={this.props.data}
        dataName={this.props.dataName}
        defaultOrderBy={this.props.defaultOrderBy}
        perPage={this.props.perPage}
        height={this.props.height}
        excludeFromSorting={this.props.excludeFromSorting}
        dateColumn={this.props.dateColumn}
        searchable={this.props.searchable}
        paginated={this.props.paginated}
        searchValue={this.props.searchValue}
        clearSearch={this.props.clearSearch}
        clickableHeaders={this.props.clickableHeaders}
        loggedIn={this.props.loggedIn}
        loginRequired={this.props.loginRequired}
        manuallySortable={this.props.manuallySortable}
        defaultOrder={this.props.defaultOrder}
        onRowClick={this.props.onRowClick}
      />
    );
  }
}

// const mapStateToProps = ({ chart }) => {
//  return { chart };
// };

// const mapActionsToProps = {
//  getChartData
// };

ScrollableTable.propTypes = {
  theme: PropTypes.string.isRequired,
  dataName: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired, // [ { column: value, ... }, ... ]
  defaultOrderBy: PropTypes.string.isRequired,
  height: PropTypes.number.isRequired,
  // non-required props
  defaultOrder: PropTypes.string, // 'desc', 'asc'
  perPage: PropTypes.number,
  excludeFromSorting: PropTypes.array,
  dateColumn: PropTypes.string, // the data of this column should be raw timestamps and should pass moment(timestamp).isValid(), for example: 2019-05-13T14:03:28.738Z or 1557825217091
  dateFormat: PropTypes.string, // the format to which dateColumn's timestamps should be converted, for example: "MMMM Do YYYY, h:mm:ss A"
  paginated: PropTypes.bool,
  searchable: PropTypes.bool,
  searchValue: PropTypes.string, // required if table is searchable
  clearSearch: PropTypes.func, // required if table is searchable
  clickableHeaders: PropTypes.array, // [ { name: string, onClick: func } ]
  loginRequired: PropTypes.bool,
  loggedIn: PropTypes.bool,
  manuallySortable: PropTypes.bool,
  onRowClick: PropTypes.func
};

export default ScrollableTable;
