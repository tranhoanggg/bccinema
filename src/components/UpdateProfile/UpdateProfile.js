import React, { useEffect, useState } from "react";
import "./UpdateProfile.css";
import poster from "../../assets/images/poster-login.jpg";

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    email: "",
    password: "",
    phone: "",
    birthday: "",
  });
  const [transactions, setTransactions] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  // ✅ Lấy user từ localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // ===========================================
  // 🔹 Lấy thông tin người dùng hiện tại
  // ===========================================
  useEffect(() => {
    if (user?.ID) {
      fetch(`http://localhost:5000/api/profile/${user.ID}`)
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setFormData({
              name: data.name || "",
              gender: data.gender || "",
              email: data.email || "",
              password: data.password || "",
              phone: data.phone || "",
              birthday: data.birthday ? data.birthday.slice(0, 10) : "",
            });
          }
        })
        .catch((err) => console.error("Lỗi tải thông tin:", err));
    }
  }, []);

  // ===========================================
  // 🔹 Lấy danh sách giao dịch
  // ===========================================
  useEffect(() => {
    if (user?.ID) {
      fetch(`http://localhost:5000/user-transactions/${user.ID}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            // Sắp xếp giảm dần theo ngày
            const sorted = data.sort(
              (a, b) => new Date(b.date) - new Date(a.date)
            );
            setTransactions(sorted);
          }
        })
        .catch((err) => console.error("Lỗi tải giao dịch:", err));
    }
  }, [user]);

  // ===========================================
  // 🔹 Xử lý nhập liệu
  // ===========================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ===========================================
  // 🔹 Submit cập nhật
  // ===========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

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
      const newWarnings = missingFields.map((key) => (
        <span key={key}>
          <span className="warning-icon">⚠️</span> Hãy điền đầy đủ{" "}
          {fieldNames[key]}
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
        `http://localhost:5000/api/profile/${user.ID}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        alert("Lỗi: " + data.message);
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Không thể kết nối đến máy chủ!");
    }
  };

  return (
    <div className="update-profile-page">
      {/* Cảnh báo */}
      <div className="update-profile warning-container global-left">
        {warnings.map((text, i) => (
          <div
            key={i}
            className="update-profile-warning-popup"
            style={{ animationDelay: `${i * 0.4}s` }}
          >
            {text}
          </div>
        ))}

        {showSuccess && (
          <div
            className="update-profile-success-popup"
            style={{ animationDelay: "0s" }}
          >
            <span className="update-profile-success-icon">✅</span>
            Cập nhật thông tin thành công!
          </div>
        )}
      </div>
      <div
        className="update-left"
        style={{ backgroundImage: `url(${poster})` }}
      ></div>

      <div className="update-right">
        <h2 className="update-title">Cập nhật thông tin tài khoản</h2>

        <form className="update-form" onSubmit={handleSubmit}>
          <label>Họ và tên</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nhập họ và tên"
          />

          <div className="login-radio">
            <span>Giới tính:</span>
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

          <label>Ngày sinh</label>
          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
          />

          <label>Số điện thoại</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Nhập số điện thoại"
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Nhập email"
          />

          <label>Mật khẩu</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Nhập mật khẩu"
          />

          <button type="submit" className="update-button">
            CẬP NHẬT
          </button>
        </form>

        {/* Bảng giao dịch */}
        <div style={{ height: "100vh" }}>
          <h3 className="transaction-title">Lịch sử giao dịch</h3>
          <table className="transaction-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Loại giao dịch</th>
                <th>Ngày giao dịch</th>
                <th>Tổng tiền (VNĐ)</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.type}</td>
                  <td>
                    {new Date(item.date).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                  <td>{Number(item.total).toLocaleString("vi-VN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
