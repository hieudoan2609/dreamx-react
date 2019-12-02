import React, { Component } from "react";
import PropTypes from "prop-types";
// import { connect } from "react-redux";

require("./TabMenu.scss");

class TabMenu extends Component {
  state = {
    highlighterOffsetLeft: 0
  };

  componentDidMount = () => {
    this.props.registerComponent(this)
  }

  componentWillUnmount = () => {
    this.props.registerComponent(undefined)
  }

  handleOnClick = e => {
    if (this.props.disabled) {
      return
    }

    this.updateHighlighter(e.target.id);
    this.props.onChange(e.target.id);
  };

  updateHighlighter = (activeTabId) => {
    const activeTab = document.getElementById(activeTabId);
    this.setState({ highlighterOffsetLeft: activeTab.offsetLeft });
  }

  render() {
    const highlighterWidth = `${100 / this.props.items.length}%`;

    return (
      <div className={`TabMenu ${this.props.theme}`}>
        {this.props.items.map(item => (
          <div
            key={item}
            className={`item ${
              item === this.props.currentItem ? "active" : ""
            }`}
            onClick={this.handleOnClick}
            id={item}
          >
            {item}
          </div>
        ))}

        <div
          className="highlighter"
          style={{
            width: highlighterWidth,
            left: this.state.highlighterOffsetLeft
          }}
        />
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
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  registerComponent: PropTypes.func.isRequired
};

export default TabMenu;
