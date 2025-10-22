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

  // 🔹 Quản lý popup xác nhận hủy
  const [canceling, setCanceling] = useState(null); // chứa item giao dịch đang chọn
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  // 🔹 Popup thông báo hủy thành công
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);

  // ✅ Lấy user từ localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // 🔹 Lấy thông tin người dùng hiện tại
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

  // 🔹 Lấy danh sách giao dịch
  const loadTransactions = () => {
    if (user?.ID) {
      fetch(`http://localhost:5000/user-transactions/${user.ID}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            const sorted = data.sort(
              (a, b) => new Date(b.date) - new Date(a.date)
            );
            setTransactions(sorted);
          }
        })
        .catch((err) => console.error("Lỗi tải giao dịch:", err));
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [user]);

  // 🔹 Xử lý nhập liệu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Submit cập nhật
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

  const handleCancelTransaction = (item) => {
    setCanceling(item);
    setShowConfirmPopup(true);
  };

  const confirmCancel = async () => {
    if (!canceling) return;

    let endpoint = "";

    // Chọn API phù hợp dựa theo loại giao dịch
    if (canceling.type === "Mua vé") {
      endpoint = `http://localhost:5000/cancel-ticket/${canceling.id.substring(
        canceling.id.lastIndexOf("-") + 1
      )}`;
    } else if (canceling.type === "Mua đồ ăn") {
      endpoint = `http://localhost:5000/cancel-goods/${canceling.id.substring(
        canceling.id.lastIndexOf("-") + 1
      )}`;
    } else if (
      canceling.type === "Mua vé (có đồ ăn đi kèm)" ||
      canceling.type === "Mua vé (kèm đồ ăn)"
    ) {
      endpoint = `http://localhost:5000/cancel-ticket-with-goods/${canceling.id.substring(
        canceling.id.lastIndexOf("-") + 1
      )}`;
    } else {
      alert("Không xác định được loại giao dịch để huỷ!");
      return;
    }

    try {
      const response = await fetch(endpoint, { method: "DELETE" });

      if (response.ok) {
        // Ẩn popup xác nhận
        setShowConfirmPopup(false);

        // Hiện popup thành công
        setShowCancelSuccess(true);
        setTimeout(() => {
          setShowCancelSuccess(false);
          setCanceling(null);
          loadTransactions(); // reload bảng
        }, 5000);
      } else {
        const data = await response.json();
        alert(data.message || "Không thể huỷ giao dịch này!");
      }
    } catch (error) {
      console.error("Lỗi huỷ giao dịch:", error);
      alert("Không thể kết nối đến máy chủ!");
    }
  };

  const closeConfirmPopup = () => {
    setShowConfirmPopup(false);
    setCanceling(null);
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

        {showCancelSuccess && (
          <div className="update-profile-success-popup">
            <span className="update-profile-success-icon">✅</span>
            Đã huỷ giao dịch thành công. Cảm ơn bạn đã sử dụng dịch vụ!
          </div>
        )}
      </div>

      {/* ====== Overlay + Popup xác nhận ====== */}
      {showConfirmPopup && (
        <div className="updateprofile overlay" onClick={closeConfirmPopup}>
          <div className="confirm-popup" onClick={(e) => e.stopPropagation()}>
            <h3>Bạn có chắc chắn muốn huỷ giao dịch?</h3>
            <p>
              Sau khi huỷ giao dịch, chúng tôi sẽ hoàn trả tiền đơn hàng vào số
              tài khoản bạn đã thanh toán (có khấu trừ 10%).
            </p>
            <div className="updateprofile-confirm-buttons">
              <button
                className="updateprofile-cancel-btn"
                onClick={closeConfirmPopup}
              >
                Đóng
              </button>
              <button
                className="updateprofile-confirm-btn"
                onClick={confirmCancel}
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}

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

          <div className="updateprofile-radio">
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
        <div>
          <h3 className="transaction-title">Lịch sử giao dịch</h3>
          <table className="transaction-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Loại giao dịch</th>
                <th>Ngày giao dịch</th>
                <th>Tổng tiền (VNĐ)</th>
                <th></th>
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
                  <td>
                    <button
                      className="cancel-transaction-btn"
                      onClick={() => handleCancelTransaction(item)}
                    >
                      Huỷ
                    </button>
                  </td>
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
