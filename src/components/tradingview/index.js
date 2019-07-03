import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

import { widget } from './charting_library/charting_library.min';
import Datafeed from './datafeed'

const config = {
    supported_resolutions: ["5", "15", "60", "D"],
    resolution_human_readable_labels: { "5": "5m", "15": "15m", "60": "1H", "D": "1D" }
};

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

    const themeChanged = prevProps.theme !== this.props.theme
    if (themeChanged) {
      this.loadTheme(this.props.theme)
    }
  };

  loadTheme = (theme) => {
    this.tvWidget.changeTheme(theme)
    let overrides = {
      "paneProperties.legendProperties.showSeriesTitle": false,
      "paneProperties.legendProperties.showBarChange": false,
    }
    switch(theme) {
      case 'light':
        overrides["paneProperties.background"] = "#ffffff"
        break
      case 'dark':
        overrides["paneProperties.background"] = "#384256"
        break
      default:
        throw new Error('unknown theme')
    }
    this.tvWidget.applyOverrides(overrides)
  }

  componentDidMount = () => {
    this.props.onLoading()
    const widgetOptions = {
      debug: false,
      symbol: this.props.symbol,
      datafeed: new Datafeed(this.props.apiHttpRoot, this.props.cable, config),
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
        "header_interval_dialog_button",
        "left_toolbar",
        "header_resolutions"
      ],
      enabled_features: [
        "hide_left_toolbar_by_default",
      ],
      autosize: this.props.autosize,
      fullscreen: this.props.fullscreen,
      custom_css_url: '../../tradingview.css',
      theme: this.props.theme
    }

    const tvWidget = new widget(widgetOptions);
    this.addEventListeners(tvWidget)
    this.tvWidget = tvWidget;
  }

  addEventListeners = (tvWidget) => {
    tvWidget.onChartReady(() => {
      this.loadTheme(this.props.theme)
      this.addResolutionButtons(tvWidget)
      this.props.onLoaded()
    })
  }

  addResolutionButtons = (tvWidget) => {
    config.supported_resolutions.forEach((resolution) => {
      const button = tvWidget.createButton()
      button.textContent = config.resolution_human_readable_labels[resolution];
      button.addEventListener('click', () => {
        const symbol = tvWidget.symbolInterval().symbol
        const interval = resolution
        tvWidget.setSymbol(symbol, interval)
      });
    })
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
  symbol: PropTypes.string.isRequired,
  onLoading: PropTypes.func.isRequired,
  onLoaded: PropTypes.func.isRequired,
  theme: PropTypes.string.isRequired
};

export default TradingView;
