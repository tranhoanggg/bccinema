import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import "./GoodsPayment.css";

function GoodsPayment({
  filmId,
  selectedDate,
  selectedTime,
  selectedRoom,
  selectedSeats,
}) {
  const navigate = useNavigate();
  const [goodsData, setGoodsData] = useState([]);
  const [showQR, setShowQR] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [qrValue, setQrValue] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || {};

  // 🔹 Khi load component: lấy toàn bộ sản phẩm và chọn ngẫu nhiên 3 cái
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/goods`)
      .then((res) => res.json())
      .then((data) => {
        // Random 3 ID ngẫu nhiên từ 1 đến 16
        const randomIds = Array.from(
          { length: 3 },
          () => Math.floor(Math.random() * 16) + 1,
        );

        // Lọc 3 sản phẩm theo ID
        const selected = data
          .filter((g) => randomIds.includes(g.ID))
          .map((g) => ({ ...g, quantity: 0 }));

        setGoodsData(selected);
      })
      .catch((err) => console.error("Lỗi khi lấy dữ liệu goods:", err));
  }, []);

  // 🔹 Hàm tăng giảm số lượng
  const handleQuantityChange = (goodsId, delta) => {
    setGoodsData((prev) =>
      prev.map((g) =>
        g.ID === goodsId
          ? { ...g, quantity: Math.max(0, g.quantity + delta) }
          : g,
      ),
    );
  };

  const isConfirmEnabled =
    selectedDate &&
    selectedTime &&
    selectedRoom &&
    selectedSeats &&
    selectedSeats.length > 0 &&
    selectedPayment &&
    agreed;

  const handleConfirm = () => {
    const total =
      goodsData.reduce((sum, g) => sum + g.price * g.quantity, 0) +
      (selectedSeats?.length || 0) * 45000;

    const qrText = `${selectedPayment.toUpperCase()}_${user.email}_${total}`;
    setQrValue(qrText);
    setShowQR(true);
  };

  const handleFakePayment = () => {
    const goodsPurchased = goodsData
      .filter((g) => g.quantity > 0)
      .map((g) => ({
        goods_id: g.ID, // ✅ server cần goods_id
        quantity: g.quantity, // ✅ số lượng
      }));

    const payload = {
      film_id: filmId,
      user_id: user.ID,
      selectedSeats: selectedSeats || [],
      selectedRoom,
      selectedDate,
      selectedTime,
      paymentMethod: selectedPayment, // ✅ trùng key với backend
      goods: goodsPurchased, // ✅ định dạng đúng theo server
    };

    fetch(`${process.env.REACT_APP_API_URL}/complete-bookticket`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setShowPopup(true);
          setTimeout(() => {
            setShowPopup(false);
            setTimeout(() => navigate("/"), 600);
          }, 3000);
        } else {
          alert("❌ Có lỗi khi hoàn tất đặt vé!");
        }
      })
      .catch((err) => console.error("Lỗi fakepayment:", err));
  };

  return (
    <div className="payment-container">
      <div className="payment-left">
        {goodsData.map((item) => (
          <div key={item.ID} className="payment-item">
            <img
              src={require(`../../assets/images/Goods/${item.ID}.png`)}
              alt={item.name}
            />
            <div className="info">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <div className="quantity">
                <button onClick={() => handleQuantityChange(item.ID, -1)}>
                  −
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item.ID, 1)}>
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="payment-right">
        {!showQR ? (
          <>
            <h3>Thông tin người nhận</h3>
            <p>
              <strong>Họ tên:</strong> {user.name}
            </p>
            <p>
              <strong>SĐT:</strong> {user.phone}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>

            <h3 style={{ marginTop: 18 + "px" }}>Phương thức thanh toán</h3>
            <div className="payment-options">
              {["momo", "shopeepay", "zalopay", "vnpay"].map((method) => (
                <label key={method}>
                  <input
                    type="radio"
                    name="pay"
                    onChange={() => setSelectedPayment(method)}
                  />{" "}
                  {method.toUpperCase()}
                </label>
              ))}
            </div>

            <label className="agree">
              <input
                type="checkbox"
                onChange={(e) => setAgreed(e.target.checked)}
              />
              Tôi đã đọc và đồng ý với <a href="#">Điều khoản thanh toán</a>
            </label>

            <button
              disabled={!isConfirmEnabled}
              onClick={handleConfirm}
              className={`bookticket-confirm-btn ${
                isConfirmEnabled ? "active" : "disabled"
              }`}
            >
              XÁC NHẬN
            </button>
          </>
        ) : (
          <div className="qr-section">
            <QRCodeCanvas value={qrValue} size={200} />
            <p>Hãy quét mã QR để hoàn thành thanh toán.</p>
            <button className="fake-pay-btn" onClick={handleFakePayment}>
              Thanh toán thành công
            </button>
          </div>
        )}
      </div>

      {/* Popup overlay */}
      {showPopup && (
        <div className={`success-overlay ${showPopup ? "active" : ""}`}>
          <div className={`success-popup ${showPopup ? "" : "hide"}`}>
            <h2>🎉 Thanh toán thành công!</h2>
            <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default GoodsPayment;
