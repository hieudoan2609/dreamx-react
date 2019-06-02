import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

// import "./FixedHeightTable.scss";
import Table from "./Table";

class FixedHeightTable extends Component {
  render() {
    return (
      <Table
        theme={this.props.theme}
        data={this.props.data}
        defaultOrderBy={this.props.defaultOrderBy}
        excludeFromSorting={this.props.excludeFromSorting}
        excludeFromRendering={this.props.excludeFromRendering}
        searchable={this.props.searchable}
        searchValue={this.props.searchValue}
        dateColumn={this.props.dateColumn}
        dataName={this.props.dataName}
        paginated={this.props.paginated}
        perPage={this.props.perPage}
        height={this.props.height}
        clearSearch={this.props.clearSearch}
        identifiedBy={this.props.identifiedBy}
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

FixedHeightTable.propTypes = {
  theme: PropTypes.string.isRequired,
  dataName: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired, // [ { column: value, ... }, ... ]
  defaultOrderBy: PropTypes.string.isRequired,
  perPage: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  identifiedBy: PropTypes.string.isRequired, // a unique attribute that can be used to identify records from one another, for example { symbol: "ONE", balance: "1.66" } can be identified by the "symbol" key since it is unique
  // non-required props
  excludeFromSorting: PropTypes.array,
  excludeFromRendering: PropTypes.array,
  dateColumn: PropTypes.string, // the data of this column should be raw timestamps and should pass moment(timestamp).isValid(), for example: 2019-05-13T14:03:28.738Z or 1557825217091
  dateFormat: PropTypes.string, // the format to which dateColumn's timestamps should be converted, for example: "MMMM Do YYYY, h:mm:ss A"
  paginated: PropTypes.bool,
  searchable: PropTypes.bool,
  searchValue: PropTypes.string, // required if table is searchable
  clearSearch: PropTypes.func // required if table is searchable
};

export default FixedHeightTable;
