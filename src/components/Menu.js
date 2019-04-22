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
    // const currentItem = this.current();
    // if (this[currentItem]) {
    //   // only execute if there is a ref defined for currentItem
    //   const currentItemWidth = this[currentItem].current.clientWidth;
    //   const currentItemOffsetLeft = this[currentItem].current.offsetLeft;
    //   if (
    //     this.state.highlighterWidth !== currentItemWidth ||
    //     this.state.highlighterOffsetLeft !== currentItemOffsetLeft
    //   ) {
    //     this.setState({
    //       highlighterWidth: currentItemWidth,
    //       highlighterOffsetLeft: currentItemOffsetLeft
    //     });
    //   }
    // } else {
    //   // set highlighter width and offset back to 0 if there is no active item
    //   if (
    //     this.state.highlighterWidth !== 0 ||
    //     this.state.highlighterOffsetLeft !== 0
    //   ) {
    //     this.setState({
    //       highlighterWidth: 0,
    //       highlighterOffsetLeft: 0
    //     });
    //   }
    // }

    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.setState({ mobileMenuHidden: true });
    }
  };

  current = () => {
    const rootItem = this.props.navItems.filter(
      item => item.pathname === "/"
    )[0];

    let currentItem = this.props.location.pathname.split("/")[1];

    if (currentItem === "") {
      currentItem = rootItem ? rootItem.label : "";
    }

    return currentItem;
  };

  render() {
    const mobileMenuHiddenClass = this.state.mobileMenuHidden ? "hidden" : "";

    return (
      <div className={`Menu ${this.props.theme}`}>
        <div className="desktop container">
          <div className="row">
            <div className="col-12">
              <div className="wrapper">
                <div className="pull-left">
                  <Link to="/" className="brand">
                    <img width={20} src={this.props.logo} alt="" />
                    <span>Odin Trade</span>
                  </Link>

                  <div className="items d-none d-md-flex">
                    {this.props.navItems.map((item, index) => (
                      <Link
                        className={`item ${
                          this.current() === item.label ? "active" : ""
                        }`}
                        key={index}
                        id={item.label}
                        to={item.pathname}
                      >
                        {item.label}
                      </Link>
                    ))}

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
            {this.props.navItems.map((item, index) => (
              <Link
                className={`item ${
                  this.current() === item.label ? "active" : ""
                }`}
                key={index}
                id={item.label}
                to={item.pathname}
              >
                {item.label}
              </Link>
            ))}
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
  navItems: PropTypes.array.isRequired, // [ { label, pathname }, ... ]
  toggleTheme: PropTypes.func.isRequired
};

export default withRouter(Menu);
