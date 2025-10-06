import React, { useState } from "react";
import "./LoginPopup.css";
import poster from "../../assets/images/poster-login.jpg";

const LoginPopup = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true); // true = login, false = register

  return (
    <div className="login-overlay">
      {/* 🔹 Video nền phía sau */}
      <video
        className="login-bg-video"
        autoPlay
        muted
        loop
        playsInline
        src="/assets/videos/background.mp4"
      />

      <div className="login-popup animate-in">
        {/* Left Side - Poster */}
        <div
          className="login-left"
          style={{ backgroundImage: `url(${poster})` }}
        ></div>

        {/* Right Side - Form */}
        <div className="login-right">
          <h2 className="login-title">
            {isLogin ? "Đăng nhập hệ thống" : "Đăng ký tài khoản"}
          </h2>

          <form className="login-form" autoComplete="off">
            {!isLogin && (
              <>
                <label className="login-label">Họ và tên</label>
                <input
                  type="text"
                  placeholder="Nhập họ tên"
                  className="login-input"
                />

                <label className="login-label">Số điện thoại</label>
                <input
                  type="text"
                  placeholder="Nhập số điện thoại"
                  className="login-input"
                />

                <label className="login-label">Email</label>
                <input
                  type="email"
                  placeholder="Nhập email"
                  className="login-input"
                />

                <label className="login-label">Mật khẩu</label>
                <input
                  type="password"
                  placeholder="Tạo mật khẩu"
                  className="login-input"
                />
              </>
            )}

            {isLogin && (
              <>
                <label className="login-label">Email</label>
                <input
                  type="email"
                  placeholder="Nhập email"
                  className="login-input"
                />

                <label className="login-label">Mật khẩu</label>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu"
                  className="login-input"
                />
              </>
            )}

            <button type="submit" className="login-button">
              {isLogin ? "ĐĂNG NHẬP" : "ĐĂNG KÝ"}
            </button>
          </form>

          <p className="toggle-text">
            {isLogin ? (
              <>
                Nếu bạn chưa có tài khoản,{" "}
                <span className="toggle-link" onClick={() => setIsLogin(false)}>
                  đăng ký ngay
                </span>
              </>
            ) : (
              <>
                Nếu bạn đã có tài khoản,{" "}
                <span className="toggle-link" onClick={() => setIsLogin(true)}>
                  đăng nhập ngay
                </span>
              </>
            )}
          </p>

          {/* Nút đóng */}
          <button className="close-btn" onClick={onClose}>
            <a style={{ textDecoration: "none", color: "#00ff99" }} href="/">
              ✕
            </a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
