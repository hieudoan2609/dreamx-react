import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./SearchTable.scss";

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
              {this.props.data.map((row, i) => (
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
  defaultOrderBy: PropTypes.string.isRequired
};

export default SearchTable;
