import React from "react";
import "./header.css";
import { Container } from "react-bootstrap";
import { NavLink, Link } from "react-router-dom";

// Nav links

const NAV__LINKS = [
  {
    display: "Login",
    url: "/login",
  },

  {
    display: "Home",
    url: "/home",
  },
  {
    display: "Market",
    url: "/market",
  },
  {
    display: "Create",
    url: "/create",
  },
  {
    display: "Contact",
    url: "/contact",
  },
];

const Header = () => {
  return (
    <header className="header">
      <Container>
        <div className="navigation">
          <div className="logo">
            <h2 className="d-flex gap-2 align-items-center">
              <span>
                <i class="ri-safe-2-fill"></i>
              </span>
              CreDefi
            </h2>
          </div>

          <div className="nav__menu">
            <ul className="nav__list">
              {NAV__LINKS.map((item, index) => (
                <li className="nav__item" key={index}>
                  <NavLink to={item.url}>{item.display}</NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="nav__right  d-flex align-items-center gap-5">
            <button className="btn">
              <Link to="/wallet" className="d-flex align-items-center gap-2">
                <span>
                  <i class="ri-wallet-line"></i>
                </span>
                Connect Wallet
              </Link>
            </button>

            <span className="mobile__menu">
              <i class="ri-menu-line"></i>
            </span>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
