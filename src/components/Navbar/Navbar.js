import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import "./Navbar.css"; // import css riêng

const NavigationBar = () => {
  return (
    <Navbar expand="lg">
      <Container>
        {/* Logo */}
        <Navbar.Brand as={NavLink} to="/" className="navbar-logo">
          <img src={logo} alt="BC Cinema" />
        </Navbar.Brand>

        {/* Menu */}
        <Nav className="navbar-menu fw-bold">
          <Nav.Link as={NavLink} to="/homepage" className="navbar-item" end>
            TRANG CHỦ
          </Nav.Link>
          <Nav.Link as={NavLink} to="/movies" className="navbar-item" end>
            PHIM
          </Nav.Link>
          <Nav.Link as={NavLink} to="/food" className="navbar-item" end>
            ĐỒ ĂN & THỨC UỐNG
          </Nav.Link>
          <Nav.Link as={NavLink} to="/promotions" className="navbar-item" end>
            ƯU ĐÃI & KHUYẾN MÃI
          </Nav.Link>
        </Nav>
        <Nav.Link as={NavLink} to="/members" className="member-btn">
          <i className="bi bi-person-fill"></i> Thành viên
        </Nav.Link>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
