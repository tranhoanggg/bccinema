import React from "react";
import "./Footer.css";
import RightImg from "../../assets/images/right.png";
import FbIcon from "../../assets/images/Icon/facebook.png";
import IgIcon from "../../assets/images/Icon/instagram.png";
import TiktokIcon from "../../assets/images/Icon/tiktok.png";
import YtIcon from "../../assets/images/Icon/youtube.png";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* VỀ BC CINEMA */}
        <div className="footer-column">
          <h2 className="footer-title">VỀ BC CINEMA</h2>
          <div className="footer-divider"></div>
          <p>
            <a href="#" className="footer-item-has-link">
              Liên hệ
            </a>
          </p>
          <a href="#">
            <img
              src={RightImg}
              alt="Đã thông báo bộ công thương"
              className="right-img"
            />
          </a>
        </div>

        {/* QUY ĐỊNH & ĐIỀU KHOẢN */}
        <div className="footer-column">
          <h2 href="#" className="footer-title">
            QUY ĐỊNH & ĐIỀU KHOẢN
          </h2>
          <div className="footer-divider"></div>
          <p>
            <a href="#" className="footer-item-has-link">
              Điều khoản
            </a>
          </p>
          <p>
            <a href="#" className="footer-item-has-link">
              Hướng dẫn đặt vé trực tuyến
            </a>
          </p>
          <p>
            <a href="#" className="footer-item-has-link">
              Quy định và chính sách chung
            </a>
          </p>
          <p>
            <a href="#" className="footer-item-has-link">
              Chính sách bảo vệ thông tin cá nhân của người tiêu dùng
            </a>
          </p>
        </div>

        {/* CHĂM SÓC KHÁCH HÀNG */}
        <div className="footer-column">
          <h2 className="footer-title">CHĂM SÓC KHÁCH HÀNG</h2>
          <div className="footer-divider"></div>
          <p>
            <strong>Hotline:</strong> 19002099
          </p>
          <p>
            <strong>Giờ làm việc:</strong> 9:00 - 22:00 (Tất cả các ngày bao gồm
            cả Lễ, Tết)
          </p>
          <p>
            <strong>Email hỗ trợ:</strong> cskh@bccinema.vn
          </p>

          <h5 className="social-title">MẠNG XÃ HỘI</h5>
          <div className="social-icons">
            <img src={FbIcon} alt="facebook" className="social-icon" />
            <img src={IgIcon} alt="instagram" className="social-icon" />
            <img src={TiktokIcon} alt="tiktok" className="social-icon" />
            <img src={YtIcon} alt="youtube" className="social-icon" />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
