import React, { useState, useRef, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import "./Navbar.css";

const NavigationBar = ({ onMemberClick }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Kiểm tra trạng thái đăng nhập khi load
  useEffect(() => {
    // cập nhật khi custom event phát ra (trong cùng tab)
    const onUserLogin = (e) => {
      setIsLoggedIn(true);
    };
    // storage event fires only in other tabs — vẫn đăng ký hữu ích cho multi-tab
    const onStorage = () => {
      const user = localStorage.getItem("user");
      setIsLoggedIn(!!user);
    };

    window.addEventListener("user-logged-in", onUserLogin);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("user-logged-in", onUserLogin);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // ✅ Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMemberClick = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      if (onMemberClick) onMemberClick();
    } else {
      setShowMenu((prev) => !prev);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setShowMenu(false);
    navigate("/");
  };

  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container>
        {/* Logo */}
        <Navbar.Brand as={NavLink} to="/" className="navbar-logo">
          <img src={logo} alt="BC Cinema" />
        </Navbar.Brand>

        {/* Menu chính */}
        <Nav className="navbar-menu fw-bold">
          <Nav.Link as={NavLink} to="/" className="navbar-item" end>
            TRANG CHỦ
          </Nav.Link>
          <Nav.Link as={NavLink} to="/films" className="navbar-item" end>
            PHIM
          </Nav.Link>
          <Nav.Link as={NavLink} to="/goods" className="navbar-item" end>
            ĐỒ ĂN & THỨC UỐNG
          </Nav.Link>
          <Nav.Link as={NavLink} to="/membership" className="navbar-item" end>
            QUYỀN LỢI
          </Nav.Link>
        </Nav>

        {/* Thành viên */}
        <div className="member-section" ref={dropdownRef}>
          <button
            className={`member-btn ${showMenu ? "active" : ""}`}
            onClick={handleMemberClick}
          >
            <i className="bi bi-person-fill"></i> Thành viên{" "}
            {isLoggedIn && (
              <i
                className={`bi bi-chevron-${showMenu ? "up" : "down"}`}
                style={{ marginLeft: "6px" }}
              ></i>
            )}
          </button>

          {/* Dropdown khi đã đăng nhập */}
          {isLoggedIn && showMenu && (
            <div className="member-dropdown animate-slide">
              <div
                className="dropdown-item"
                onClick={() => {
                  navigate("/profile");
                  setShowMenu(false);
                }}
              >
                <i className="bi bi-person-circle"></i> Thông tin tài khoản
              </div>
              <div className="dropdown-item" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right"></i> Đăng xuất
              </div>
            </div>
          )}
        </div>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
