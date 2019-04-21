import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./SearchTable.scss";

class SearchTable extends Component {
  formatNameToUserFriendly = name => {
    return name
      .split(/(?=[A-Z])/)
      .join(" ")
      .toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase());
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
                  <th scope="col" key={col}>
                    {this.formatNameToUserFriendly(col)}
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
  searchInputPlaceholder: PropTypes.string.isRequired
};

export default SearchTable;
