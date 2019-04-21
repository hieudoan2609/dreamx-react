import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
// import { connect } from "react-redux";

import "./Menu.scss";

class Menu extends Component {
  constructor(props) {
    super(props);

    for (let item of this.props.navItems) {
      this[item.label] = React.createRef();
    }
  }

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

  handleItemClick = e => {
    // console.log(e.target.id);
  };

  current = () => {
    let currentPath = this.props.location.pathname.split("/")[1];

    if (currentPath === "") {
      currentPath = "home";
    }

    return currentPath;
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
                      <div
                        className={`item ${
                          this.current() === item.label ? "active" : ""
                        }`}
                        ref={this[item.label]}
                        key={index}
                        id={item.label}
                        onClick={this.handleItemClick}
                      >
                        {item.label}
                      </div>
                    ))}

                    <div className="highlighter" />
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
              <div
                className={`item ${
                  this.current() === item.label ? "active" : ""
                }`}
                key={index}
                onClick={this.handleItemClick}
              >
                {item.label}
              </div>
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
