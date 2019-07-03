import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
// import { connect } from "react-redux";

import "./Menu.scss";

class Menu extends Component {
  state = {
    mobileMenuHidden: true,
    highlighterWidth: 0,
    highlighterOffsetLeft: 0
  };

  toggleMobileMenu = () => {
    this.setState({ mobileMenuHidden: !this.state.mobileMenuHidden });
  };

  componentDidUpdate = prevProps => {
    this.updateHighlighter();

    const routeChanged =
      this.props.location.pathname !== prevProps.location.pathname;
    if (routeChanged) {
      this.updateMobileMenu();
    }
  };

  updateHighlighter = () => {
    const activeNavItemLabel = this.getActiveNavItemLabel();

    if (!activeNavItemLabel) {
      if (
        this.state.highlighterWidth !== 0 ||
        this.state.highlighterOffsetLeft !== 0
      ) {
        this.setState({
          highlighterWidth: 0,
          highlighterOffsetLeft: 0
        });
      }

      return;
    }

    const activeNavItem = document.querySelector(
      `.desktop #${activeNavItemLabel}`
    );

    if (
      this.state.highlighterWidth === activeNavItem.clientWidth &&
      this.state.highlighterOffsetLeft === activeNavItem.offsetLeft
    ) {
      return;
    }

    this.setState({
      highlighterWidth: activeNavItem.clientWidth,
      highlighterOffsetLeft: activeNavItem.offsetLeft
    });
  };

  updateMobileMenu = () => {
    this.setState({ mobileMenuHidden: true });
  };

  getActiveNavItemLabel = () => {
    let currentTopLevelPath = this.props.location.pathname.split("/")[1];

    let activeItem;
    if (currentTopLevelPath === "") {
      activeItem =
        this.props.navItems.filter(item => item.pathname === "/")[0] ||
        this.props.navItems.filter(item => item.root === true)[0];
    } else {
      activeItem = this.props.navItems.filter(item => {
        if (item.root) {
          return this.props.rootPath.split("/")[1] === currentTopLevelPath;
        }

        return item.pathname.split("/")[1] === currentTopLevelPath;
      })[0];
    }

    const activeItemLabel = activeItem ? activeItem.label : undefined;
    return activeItemLabel;
  };

  renderNavItems = () => {
    return this.props.navItems.map((item, index) => {
      return (
        <Link
          className={`item ${
            this.getActiveNavItemLabel() === item.label ? "active" : ""
          }`}
          key={index}
          id={item.label}
          to={item.root ? this.props.rootPath : item.pathname}
        >
          {item.label}
        </Link>
      );
    });
  };

  renderMobileNavItems = () => {
    return this.props.navItems.map((item, index) => {
      return (
        <Link
          className={`item ${
            this.getActiveNavItemLabel() === item.label ? "active" : ""
          }`}
          key={index}
          id={item.label}
          to={item.root ? this.props.rootPath : item.pathname}
        >
          {item.label}
        </Link>
      );
    });
  };

  renderLogo = () => {
    const logo = this.props.theme === 'dark' ? this.props.logo.dark : this.props.logo.light

    return (
      <Link to={this.props.rootPath} className="brand">
        <img src={logo} />
      </Link>
    )
  }

  render() {
    const mobileMenuHiddenClass = this.state.mobileMenuHidden ? "hidden" : "";

    return (
      <div className={`Menu ${this.props.theme}`}>
        <div className="desktop container">
          <div className="row">
            <div className="col-12">
              <div className="wrapper">
                <div className="pull-left">
                  {this.renderLogo()}

                  <div className="items d-none d-md-flex">
                    {this.renderNavItems()}

                    <div
                      className="highlighter"
                      style={{
                        width: this.state.highlighterWidth,
                        left: this.state.highlighterOffsetLeft
                      }}
                    />
                  </div>
                </div>

                <div className="pull-right d-none d-md-flex">
                  <ion-icon name="bulb" onClick={this.props.toggleTheme} />
                </div>

                <div className="pull-right d-flex d-md-none">
                  <ion-icon name="menu" onClick={this.toggleMobileMenu} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`mobile ${mobileMenuHiddenClass}`}>
          <div className="items">
            {this.renderMobileNavItems()}
            <ion-icon
              className="item"
              name="bulb"
              onClick={this.props.toggleTheme}
            />
          </div>
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

Menu.propTypes = {
  navItems: PropTypes.array.isRequired, // [ { label, pathname }, ... ] navItems must be top-level links and will be highlighted on all sub-routes except for the root link
  toggleTheme: PropTypes.func.isRequired,
  logo: PropTypes.object.isRequired,  // { dark: string, light: string }
  theme: PropTypes.string.isRequired,
  rootPath: PropTypes.string.isRequired // will be used for both nav brand and root item
};

export default withRouter(Menu);
