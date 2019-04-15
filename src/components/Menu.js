import React, { Component } from "react";
import PropTypes from "prop-types";
import "./Menu.scss";
import { Link, NavLink } from "react-router-dom";
// import { connect } from "react-redux";

class Menu extends Component {
  render() {
    return (
      <div className="menu bg-white">
        <div className="container">
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

                <div className="pull-right">
                  <ion-icon name="bulb" onClick={this.props.toggleTheme} />
                </div>
              </div>
            </div>
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
  logo: PropTypes.string.isRequired,
  navItems: PropTypes.array.isRequired, // [ { label, pathname }, ... ]
  toggleTheme: PropTypes.func.isRequired
};

export default Menu;
