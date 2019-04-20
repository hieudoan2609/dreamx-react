import React, { Component } from "react";
import PropTypes from "prop-types";
// import { connect } from "react-redux";

require("./TabMenu.scss");

class TabMenu extends Component {
  render() {
    return (
      <div className={`TabMenu ${this.props.theme}`}>
        {this.props.items.map(item => (
          <div
            key={item}
            className={`item ${
              item === this.props.currentItem ? "active" : ""
            }`}
            onClick={() => this.props.onChange(item)}
          >
            {item}
          </div>
        ))}
      </div>
    );
  }
}

// const mapStateToProps = ({ app }) => {
//   return { app };
// };

// const mapActionsToProps = {
//  getChartData
// };

TabMenu.propTypes = {
  theme: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired, // [ { label, pathname }, ... ]
  currentItem: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default TabMenu;
