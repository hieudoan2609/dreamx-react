import React, { Component } from "react";
import "./Menu.scss";
import { Link, NavLink, withRouter } from "react-router-dom";
// import { connect } from "react-redux";

const logo = require("../images/logo.svg");

class Menu extends Component {
  items = [
    {
      label: "Home",
      pathname: "/"
    },
    {
      label: "Market",
      pathname: "/market/ETH_NJA"
    },
    {
      label: "Account",
      pathname: "/account"
    }
  ];

  render() {
    return (
      <div className="menu bg-white">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="wrapper">
                <Link to="/" className="brand">
                  <img width={20} src={logo} alt="" />
                  <span>Odin Trade</span>
                </Link>

                <div className="items">
                  {this.items.map((item, index) => (
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

// const mapDispatchToProps = {
//  getChartData
// };

export default withRouter(Menu);
