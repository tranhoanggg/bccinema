import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPopup.css";
import poster from "../../assets/images/poster-login.jpg";

const LoginPopup = ({ onClose }) => {
  const [showLoginSuccessVideo, setShowLoginSuccessVideo] = useState(false);
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState("Login");
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    email: "",
    password: "",
    phone: "",
    birthday: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [warnings, setWarnings] = useState([]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Kiểm tra phần đăng nhập
    if (isLogin === "Login") {
      const missing = [];
      if (!formData.email) missing.push("email");
      if (!formData.password) missing.push("mật khẩu");

      if (missing.length > 0) {
        const newWarnings = missing.map((field) => (
          <span>
            <span className="warning-icon">⚠️</span> Hãy điền đầy đủ {field}
          </span>
        ));

        setWarnings([]);
        newWarnings.forEach((text, i) => {
          setTimeout(() => {
            setWarnings((prev) => [...prev, text]);
            setTimeout(() => {
              setWarnings((prev) => prev.filter((w) => w !== text));
            }, 15000);
          }, i * 200);
        });
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/profile/login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
            }),
          }
        );

        const data = await response.json();

        if (response.ok && data.user) {
          // Phát video
          setShowLoginSuccessVideo(true);
          // ✅ Lưu vào localStorage
          localStorage.setItem("user", JSON.stringify(data.user));
          window.dispatchEvent(new Event("user-logged-in"));
          // ✅ Điều hướng về trang chủ
          // navigate("/");
          // ✅ Đóng popup
          if (onClose) onClose();
        } else {
          setWarnings([
            <span>
              <span className="warning-icon">⚠️</span> Email hoặc mật khẩu không
              đúng
            </span>,
          ]);
          setTimeout(() => setWarnings([]), 5000);
        }
      } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        alert("Không thể kết nối đến máy chủ!");
      }
      return;
    }

    const fieldNames = {
      name: "họ và tên",
      gender: "giới tính",
      birthday: "ngày sinh",
      phone: "số điện thoại",
      email: "email",
      password: "mật khẩu",
    };

    const missingFields = Object.keys(fieldNames).filter(
      (key) => !formData[key]
    );

    if (missingFields.length > 0) {
      const firstMissing = document.querySelector(
        `[name="${missingFields[0]}"]`
      );
      if (firstMissing) firstMissing.focus();

      const newWarnings = missingFields.map((key) => (
        <span>
          <span className="warning-icon">⚠️</span> Hãy điền đầy đủ{" "}
          {fieldNames[key]}
        </span>
      ));

      // Clear cảnh báo cũ trước khi hiển thị mới
      setWarnings([]);

      // Hiển thị cảnh báo lần lượt, mỗi cảnh báo sẽ tự biến mất sau 30s
      newWarnings.forEach((text, i) => {
        setTimeout(() => {
          setWarnings((prev) => [...prev, text]);
          setTimeout(() => {
            setWarnings((prev) => prev.filter((w) => w !== text));
          }, 15000); // giữ 30s
        }, i * 200); // cách nhau 0.4s
      });

      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setIsLogin("Login");
          setFormData({
            name: "",
            gender: "",
            email: "",
            password: "",
            phone: "",
            birthday: "",
          });
        }, 3500);
      } else {
        alert("Lỗi: " + data.message);
      }
    } catch (error) {
      console.error("Đăng ký thất bại:", error);
      alert("Không thể kết nối đến máy chủ!");
    }
  };

  return (
    <div className="login-overlay">
      <video
        className="login-bg-video"
        autoPlay
        muted
        loop
        playsInline
        src="/assets/videos/background.mp4"
      />

      {/* ✅ Warning container bám vào cạnh phải màn hình */}
      <div className="warning-container global-right">
        {warnings.map((text, i) => (
          <div
            key={i}
            className="warning-popup slide-in"
            style={{ animationDelay: `${i * 0.4}s` }}
          >
            {text}
          </div>
        ))}
      </div>

      <div className="login-popup animate-in">
        {showLoginSuccessVideo ? (
          <div className="login-success-wrapper">
            <video
              className="login-success-video"
              src="/assets/videos/LoginSuccess.mp4"
              autoPlay
              muted
              onEnded={() => {
                // Bắt đầu ẩn popup
                const popup = document.querySelector(".login-popup");
                popup?.classList.add("hide");

                // Sau một chút delay, ẩn overlay với animation
                setTimeout(() => {
                  const overlay = document.querySelector(".login-overlay");
                  overlay?.classList.add("hide");

                  // Sau khi animation overlay kết thúc, điều hướng
                  setTimeout(() => {
                    setShowLoginSuccessVideo(false);
                    if (onClose) onClose();
                    navigate("/");
                  }, 600); // khớp với thời gian overlayFadeOut
                }, 400); // delay để popup ẩn trước
              }}
            />
          </div>
        ) : showSuccess ? (
          <div className="success-wrapper">
            <div className="success-container">
              <h2 className="glitch-text" data-text="Đăng ký thành công!">
                Đăng ký thành công!
              </h2>
            </div>
          </div>
        ) : (
          <>
            <div
              className="login-left"
              style={{ backgroundImage: `url(${poster})` }}
            ></div>

            <div className="login-right">
              <h2 className="login-title">
                {isLogin === "Login"
                  ? "Đăng nhập hệ thống"
                  : "Đăng ký tài khoản"}
              </h2>

              <form
                className="login-form"
                autoComplete="off"
                onSubmit={handleSubmit}
              >
                {isLogin === "Register" && (
                  <>
                    <label className="login-label">Họ và tên</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nhập họ tên"
                      className="login-input"
                    />

                    <div className="login-radio">
                      <span className="login-radio-title">Giới tính:</span>
                      <input
                        type="radio"
                        id="male"
                        name="gender"
                        value="male"
                        checked={formData.gender === "male"}
                        onChange={handleChange}
                      />
                      <label htmlFor="male">Nam</label>
                      <input
                        type="radio"
                        id="female"
                        name="gender"
                        value="female"
                        checked={formData.gender === "female"}
                        onChange={handleChange}
                      />
                      <label htmlFor="female">Nữ</label>
                    </div>

                    <label className="login-label">Ngày sinh</label>
                    <input
                      type="date"
                      name="birthday"
                      value={formData.birthday}
                      onChange={handleChange}
                      className="login-input"
                    />

                    <label className="login-label">Số điện thoại</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Nhập số điện thoại"
                      className="login-input"
                    />

                    <label className="login-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Nhập email"
                      className="login-input"
                    />

                    <label className="login-label">Mật khẩu</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Tạo mật khẩu"
                      className="login-input"
                    />
                  </>
                )}

                {isLogin === "Login" && (
                  <>
                    <label className="login-label">Email</label>
                    <input
                      type="email"
                      placeholder="Nhập email"
                      className="login-input"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <label className="login-label">Mật khẩu</label>
                    <input
                      type="password"
                      placeholder="Nhập mật khẩu"
                      className="login-input"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </>
                )}

                <button type="submit" className="login-button">
                  {isLogin === "Login" ? "ĐĂNG NHẬP" : "ĐĂNG KÝ"}
                </button>
              </form>

              <p className="toggle-text">
                {isLogin === "Login" ? (
                  <>
                    Nếu bạn chưa có tài khoản,{" "}
                    <span
                      className="toggle-link"
                      onClick={() => setIsLogin("Register")}
                    >
                      đăng ký ngay
                    </span>
                  </>
                ) : (
                  <>
                    Nếu bạn đã có tài khoản,{" "}
                    <span
                      className="toggle-link"
                      onClick={() => setIsLogin("Login")}
                    >
                      đăng nhập ngay
                    </span>
                  </>
                )}
              </p>

              <button className="close-btn" onClick={onClose}>
                <a
                  style={{ textDecoration: "none", color: "#00ff99" }}
                  href="/"
                >
                  ✕
                </a>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPopup;
