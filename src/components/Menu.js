import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, NavLink, withRouter } from "react-router-dom";
// import { connect } from "react-redux";

import "./Menu.scss";

class Menu extends Component {
  state = {
    mobileMenuHidden: true
  };

  toggleMobileMenu = () => {
    this.setState({ mobileMenuHidden: !this.state.mobileMenuHidden });
  };

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.setState({ mobileMenuHidden: true });
    }
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
                  <Link to="/" className="brand">
                    <img width={20} src={this.props.logo} alt="" />
                    <span>Odin Trade</span>
                  </Link>

                  <div className="items d-none d-md-flex">
                    {this.props.navItems.map((item, index) => (
                      <NavLink
                        key={index}
                        to={item.pathname}
                        className="item"
                        activeClassName="active"
                        exact={true}
                      >
                        {item.label}
                      </NavLink>
                    ))}
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
              <NavLink
                key={index}
                to={item.pathname}
                className="item"
                activeClassName="active"
                exact={true}
              >
                {item.label}
              </NavLink>
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
