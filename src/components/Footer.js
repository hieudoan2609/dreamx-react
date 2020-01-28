import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./Footer.scss";

class Footer extends Component {
  render() {
    return (
      <div className={`Footer ${this.props.theme}`}>
        <div className="container">
          <div className="item">
            <a href="https://medium.com/@dreamxmarket" target="_blank" rel="noopener noreferrer">News</a>
          </div>
          <div className="item">
            <a href="https://docs.dreamx.market/" target="_blank" rel="noopener noreferrer">API</a>
          </div>
          <div className="item">
            <a href="mailto:dreamxplatform@gmail.com" target="_blank" rel="noopener noreferrer">Contact</a>
          </div>
        </div>
      </div>
    );
  }
}

// const mapStateToProps = (state) => {
//  return state;
// };

// const mapActionsToProps = {};

Footer.propTypes = {
  theme: PropTypes.string.isRequired,
};

export default Footer;
