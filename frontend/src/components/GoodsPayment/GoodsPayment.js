import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import "./GoodsPayment.css";

function GoodsPayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clickedId, cartItems } = location.state || {};
  const [goodsData, setGoodsData] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [pickupDate, setPickupDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const user = JSON.parse(localStorage.getItem("user")) || {};

  // 🔹 Lấy dữ liệu chi tiết sản phẩm trong giỏ hàng
  useEffect(() => {
    // Nếu không có giỏ hàng và cũng không có sản phẩm mua ngay → bỏ qua
    if ((!cartItems || cartItems.length === 0) && !clickedId) return;

    let updatedCart = [];

    // Nếu có giỏ hàng, map lại dữ liệu
    if (cartItems && cartItems.length > 0) {
      updatedCart = cartItems.map((item) => {
        if (item.goods_id === clickedId) {
          // Nếu người dùng bấm mua ngay sản phẩm đã có trong giỏ, +1
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });

      // Nếu sản phẩm mua ngay chưa có trong giỏ thì thêm vào
      const exists = cartItems.some((i) => i.goods_id === clickedId);
      if (clickedId && !exists) {
        updatedCart.push({ goods_id: clickedId, quantity: 1 });
      }
    }
    // Nếu không có giỏ hàng, nhưng có sản phẩm mua ngay
    else if (clickedId) {
      updatedCart = [{ goods_id: clickedId, quantity: 1 }];
    }

    const allIds = updatedCart.map((i) => i.goods_id);
    if (allIds.length === 0) return;

    fetch(
      `${process.env.REACT_APP_API_URL}/goods_in_cart?ids=${allIds.join(",")}`,
    )
      .then((res) => res.json())
      .then((data) => {
        const combined = data.map((g) => {
          const found = updatedCart.find((c) => c.goods_id === g.ID);
          return { ...g, quantity: found ? found.quantity : 1 };
        });
        setGoodsData(combined);
      })
      .catch((err) => console.error("Lỗi lấy dữ liệu goods:", err));
  }, [clickedId, cartItems]);

  // 🔹 Tổng tiền
  const total = goodsData.reduce(
    (sum, g) => sum + g.discount * (g.quantity || 1),
    0,
  );
  const qrValue = `${user.name}-${user.phone}-${total}VND`;

  // 🔹 Xử lý xoá sản phẩm
  const handleRemove = (goodsId) => {
    if (!window.confirm("Bạn có chắc muốn xoá sản phẩm này khỏi thanh toán?"))
      return;

    fetch(
      `${process.env.REACT_APP_API_URL}/cart?userId=${user.ID}&goodsId=${goodsId}`,
      {
        method: "DELETE",
      },
    )
      .then((res) => {
        if (res.ok) {
          setGoodsData((prev) => prev.filter((g) => g.ID !== goodsId));
        } else {
          console.error("Lỗi khi xoá sản phẩm khỏi giỏ hàng");
        }
      })
      .catch((err) => console.error("Lỗi khi xoá sản phẩm:", err));
  };

  // 🔹 Cập nhật số lượng
  const handleQuantityChange = (goodsId, delta) => {
    setGoodsData((prev) =>
      prev.map((g) =>
        g.ID === goodsId
          ? { ...g, quantity: Math.max(1, g.quantity + delta) }
          : g,
      ),
    );

    // Cập nhật vào database
    const item = goodsData.find((g) => g.ID === goodsId);
    if (item) {
      const newQty = Math.max(1, item.quantity + delta);
      fetch(`${process.env.REACT_APP_API_URL}/cart`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.ID,
          goodsId: goodsId,
          quantity: newQty,
        }),
      }).catch((err) => console.error("Lỗi cập nhật số lượng:", err));
    }
  };

  const handleConfirm = () => {
    if (!selectedPayment || !agreed) return;
    setShowQR(true);
  };

  const handleFakePayment = () => {
    const orderData = {
      userId: user.ID,
      paymentMethod: selectedPayment,
      pickupDate: pickupDate,
      paymentDay: new Date().toISOString().split("T")[0],
      items: goodsData.map((g) => ({
        goodsId: g.ID,
        quantity: g.quantity || 1,
      })),
    };

    fetch(`${process.env.REACT_APP_API_URL}/complete_payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Hiển thị alert thông thường
          alert(
            "🎉 Thanh toán thành công!\nCảm ơn bạn đã sử dụng dịch vụ của chúng tôi.",
          );
          // Sau khi người dùng bấm OK trên alert, tiến hành chuyển hướng
          navigate("/");
        } else {
          alert("❌ Có lỗi khi hoàn tất đặt vé!");
        }
      })
      .catch((err) => console.error("Lỗi khi cập nhật thanh toán:", err));
  };

  return (
    <div className="payment-container">
      <div className="payment-left">
        <h2>Chi tiết đơn hàng</h2>
        <hr />
        {goodsData.map((item) => (
          <div key={item.ID} className="payment-item">
            <img
              src={require(`../../assets/images/Goods/${item.ID}.png`)}
              alt={item.name}
            />
            <div className="info">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <div className="prices">
                <span className="old">{item.price.toLocaleString()} VND</span>
                <span className="new">
                  {item.discount.toLocaleString()} VND
                </span>
              </div>
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

            <button
              className="remove-btn"
              onClick={() => handleRemove(item.ID)}
            >
              ✖
            </button>
          </div>
        ))}
        <div className="total">
          Tổng tiền: <strong>{total.toLocaleString()} VND</strong>
        </div>
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

            <h3 style={{ marginTop: 18 + "px" }}>Nhận tại rạp vào ngày</h3>
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="date-input"
            />

            <h3 style={{ marginTop: 18 + "px" }}>Phương thức thanh toán</h3>
            <div className="payment-options">
              <label>
                <input
                  type="radio"
                  name="pay"
                  onChange={() => setSelectedPayment("momo")}
                />{" "}
                MoMo
              </label>
              <label>
                <input
                  type="radio"
                  name="pay"
                  onChange={() => setSelectedPayment("shopeepay")}
                />{" "}
                ShopeePay
              </label>
              <label>
                <input
                  type="radio"
                  name="pay"
                  onChange={() => setSelectedPayment("zalopay")}
                />{" "}
                ZaloPay
              </label>
              <label>
                <input
                  type="radio"
                  name="pay"
                  onChange={() => setSelectedPayment("vnpay")}
                />{" "}
                VNPAY
              </label>
            </div>

            <label className="agree">
              <input
                type="checkbox"
                onChange={(e) => setAgreed(e.target.checked)}
              />
              Tôi đã đọc và đồng ý với <a href="#">Điều khoản thanh toán</a>
            </label>

            <button
              disabled={!selectedPayment || !agreed || goodsData.length === 0}
              onClick={handleConfirm}
              className="goodspayment-confirm-btn"
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
    </div>
  );
}

export default GoodsPayment;
