import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

import { widget } from './charting_library/charting_library.min';
import Datafeed from './datafeed'

class TradingView extends Component {
  static defaultProps = {
    interval: '60',
    containerId: 'tv_chart_container',
    libraryPath: '/charting_library/',
    autosize: true,
    locale: 'en',
    fullscreen: false
  };

  componentDidUpdate = prevProps => {
    const symbolChanged = prevProps.symbol !== this.props.symbol
    if (symbolChanged) {
      this.tvWidget.setSymbol(this.props.symbol, this.props.interval)
    }
  };

  componentDidMount = () => {
    const widgetOptions = {
      debug: false,
      symbol: this.props.symbol,
      datafeed: new Datafeed(this.props.apiHttpRoot, this.props.cable),
      interval: this.props.interval,
      container_id: this.props.containerId,
      library_path: this.props.libraryPath,
      locale: this.props.locale,
      // available features: http://tradingview.github.io/featuresets.html
      disabled_features: [
        "header_screenshot",
        "border_around_the_chart",
        "header_saveload",
        "header_settings",
        "header_undo_redo",
        "header_compare",
        "header_indicators",
        "header_symbol_search",
        "control_bar",
        "go_to_date",
        "timeframes_toolbar",
        "context_menus",
      ],
      enabled_features: [
        "hide_left_toolbar_by_default",
      ],
      autosize: this.props.autosize,
      fullscreen: this.props.fullscreen,
      custom_css_url: '../../tradingview.css'
    }

    const tvWidget = new widget(widgetOptions);
    this.tvWidget = tvWidget;
  }

  componentWillUnmount() {
    if (this.tvWidget !== null) {
      this.tvWidget.remove();
      this.tvWidget = null;
    }
  }

  render() {
    return <div id={this.props.containerId} />;
  }
}

// const mapStateToProps = (state) => {
//  return state;
// };

// const mapActionsToProps = {};

TradingView.propTypes = {
  apiHttpRoot: PropTypes.string.isRequired,
  cable: PropTypes.object.isRequired,
  symbol: PropTypes.string.isRequired
};

export default TradingView;
