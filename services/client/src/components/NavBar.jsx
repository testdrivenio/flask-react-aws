import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import "./NavBar.css";

const titleStyle = {
  fontWeight: "bold"
};

const NavBar = props => (
  <nav
    className="navbar is-dark"
    role="navigation"
    aria-label="main navigation"
  >
    <section className="container">
      <div className="navbar-brand">
        <Link to="/" className="navbar-item nav-title" style={titleStyle}>
          {props.title}
        </Link>
        <span
          className="nav-toggle navbar-burger"
          onClick={() => {
            let toggle = document.querySelector(".nav-toggle");
            let menu = document.querySelector(".navbar-menu");
            toggle.classList.toggle("is-active");
            menu.classList.toggle("is-active");
          }}
        >
          <span />
          <span />
          <span />
        </span>
      </div>
      <div className="navbar-menu">
        <div className="navbar-start">
          <Link to="/about" className="navbar-item">
            About
          </Link>
          <Link to="/status" className="navbar-item">
            User Status
          </Link>
        </div>
        <div className="navbar-end">
          <Link to="/register" className="navbar-item">
            Register
          </Link>
          <Link to="/login" className="navbar-item">
            Log In
          </Link>
          <span
            // eslint-disable-next-line react/jsx-handler-names
            onClick={props.logoutUser}
            className="navbar-item
            link"
          >
            Log Out
          </span>
        </div>
      </div>
    </section>
  </nav>
);

NavBar.propTypes = {
  title: PropTypes.string.isRequired,
  logoutUser: PropTypes.func.isRequired
};

export default NavBar;
