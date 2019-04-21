import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./SearchTable.scss";

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(rawArray, cmp) {
  const stabilizedThis = rawArray.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

class SearchTable extends Component {
  state = {
    order: "desc",
    orderBy: this.props.defaultOrderBy
  };

  formatNameToUserFriendly = name => {
    return name
      .split(/(?=[A-Z])/)
      .join(" ")
      .toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  handleSort = property => {
    if (this.props.excludeFromSorting.includes(property)) {
      return;
    }

    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    this.setState({ orderBy, order });
  };

  render() {
    return (
      <div className={`SearchTable ${this.props.theme}`}>
        <div className="input-group">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroupPrepend3">
              <ion-icon name="search" />
            </span>
          </div>
          <input
            className="form-control search"
            placeholder={this.props.searchInputPlaceholder}
            spellCheck="false"
          />
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                {Object.keys(this.props.data[0]).map(col => (
                  <th
                    scope="col"
                    key={col}
                    onClick={() => this.handleSort(col)}
                  >
                    <div className="body">
                      {this.state.orderBy === col && (
                        <div className={`icon ${this.state.order}`}>
                          <ion-icon name="arrow-dropdown" />
                        </div>
                      )}

                      <div className="text">
                        {this.formatNameToUserFriendly(col)}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stableSort(
                this.props.data,
                getSorting(this.state.order, this.state.orderBy)
              ).map((row, i) => (
                <tr key={i}>
                  {Object.keys(row).map(key => (
                    <td key={key}>{row[key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

SearchTable.propTypes = {
  theme: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired, // [ { column: value, ... }, ... ]
  searchInputPlaceholder: PropTypes.string.isRequired,
  defaultOrderBy: PropTypes.string.isRequired,
  excludeFromSorting: PropTypes.array
};

export default SearchTable;
