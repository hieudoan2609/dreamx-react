import moment from "moment";
import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./Table.scss";
import Paginator from "./Paginator";

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

class Table extends Component {
  constructor(props) {
    super(props);
    this.table = React.createRef();
  }

  state = {
    order: "desc",
    orderBy: this.props.defaultOrderBy,
    currentPage: 1,
    perPage: this.props.perPage || 10
  };

  paginate = records => {
    const { currentPage, perPage } = this.state;
    const firstIndex = (currentPage - 1) * perPage;
    const lastIndex = firstIndex + perPage;
    const paginated = records.slice(firstIndex, lastIndex);
    return paginated;
  };

  formatNameToUserFriendly = name => {
    return name
      .split(/(?=[A-Z])/)
      .join(" ")
      .toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  handleSort = property => {
    if (
      this.props.excludeFromSorting &&
      this.props.excludeFromSorting.includes(property)
    ) {
      return;
    }

    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    this.setState({ orderBy, order });
  };

  handlePageChange = pageNumber => {
    this.setState({ currentPage: parseInt(pageNumber) });
  };

  componentDidUpdate = (prevProps, prevState) => {
    const previousPage = prevState.currentPage;
    const currentPage = this.state.currentPage;
    const previousSearchValue = prevProps.searchValue;
    const currentSearchValue = this.props.searchValue;
    if (previousPage !== currentPage) {
      this.scrollToTableTop();
    }
    if (previousSearchValue !== currentSearchValue) {
      this.setState({ currentPage: 1 });
    }
  };

  scrollToTableTop = () => {
    const offset = 200;
    const currentScrolled = window.pageYOffset;
    const tableTop =
      this.table.current.getBoundingClientRect().top + currentScrolled - offset;
    window.scrollTo(0, tableTop);
  };

  renderTable = () => {
    const totalPages = this.props.paginated
      ? Math.ceil(this.props.data.length / this.props.perPage)
      : undefined;
    const sorted = stableSort(
      this.props.data,
      getSorting(this.state.order, this.state.orderBy)
    );
    const records = this.props.paginated ? this.paginate(sorted) : sorted;

    return (
      <div className={`table-wrapper ${this.props.dataName}`} ref={this.table}>
        <div className="table-responsive" style={{ height: this.props.height }}>
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
              {records.map((row, i) => (
                <tr key={i}>
                  {Object.keys(row).map(key => {
                    if (
                      this.props.dateColumn &&
                      key === this.props.dateColumn
                    ) {
                      const format =
                        this.props.dateFormat || "MMMM Do YYYY, h:mm:ss a";
                      const formattedDate = moment(row[key]).format(format);
                      return <td key={key}>{formattedDate}</td>;
                    }

                    return <td key={key}>{row[key]}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {this.props.paginated === true && totalPages > 1 && (
          <Paginator
            theme={this.props.theme}
            currentPage={this.state.currentPage}
            perPage={this.state.perPage}
            totalPages={totalPages}
            handlePageChange={this.handlePageChange}
          />
        )}
      </div>
    );
  };

  renderEmptyTable = () => {
    return (
      <div className="not-available">
        No {this.props.dataName} coule be found.
      </div>
    );
  };

  render() {
    return (
      <div className={`Table ${this.props.theme}`}>
        {this.props.data.length === 0 && this.renderEmptyTable()}
        {this.props.data.length > 0 && this.renderTable()}
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

Table.propTypes = {
  theme: PropTypes.string.isRequired,
  dataName: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired, // [ { column: value, ... }, ... ]
  defaultOrderBy: PropTypes.string.isRequired,
  // non-required props
  excludeFromSorting: PropTypes.array,
  dateColumn: PropTypes.string, // the data of this column should be raw timestamps and should pass moment(timestamp).isValid(), for example: 2019-05-13T14:03:28.738Z or 1557825217091
  dateFormat: PropTypes.string, // the format to which dateColumn's timestamps should be converted, for example: "MMMM Do YYYY, h:mm:ss A"
  paginated: PropTypes.bool,
  perPage: PropTypes.number,
  height: PropTypes.number,
  searchValue: PropTypes.string // required if table is searchable
};

export default Table;
