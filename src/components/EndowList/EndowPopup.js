import React, { useEffect, useState } from "react";
import "./EndowPopup.css";

function EndowPopup({ id, onClose }) {
  const [data, setData] = useState(null);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:5000/endow/${id}`)
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => console.error("Lỗi fetch chi tiết endow:", err));
  }, [id]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 400); // trễ theo animation
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("endow-overlay")) handleClose();
  };

  if (!data) return null;

  const imagePath = require(`../../assets/images/Endow/${data.ID}.jpg`);

  return (
    <div className="endow-overlay" onClick={handleOverlayClick}>
      <div className={`endow-popup ${closing ? "closing" : ""}`}>
        <button className="popup-close" onClick={handleClose}>
          ×
        </button>

        <div className="popup-content">
          <div className="popup-image">
            <img src={imagePath} alt={data.name} />
          </div>

          <div className="popup-text">
            <h2 className="popup-title">{data.name}</h2>
            <p className="popup-day">{data.day}</p>
            <div
              className="popup-detail"
              dangerouslySetInnerHTML={{ __html: data.detail }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EndowPopup;
