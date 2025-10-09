import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import "./ComboDetail.css";

function ComboDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [combo, setCombo] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    fetch(`http://localhost:5000/combo/${id}`)
      .then((res) => res.json())
      .then((data) => setCombo(data))
      .catch((err) => console.error("Lỗi tải combo:", err));
  }, [id]);

  if (!combo) return <div className="combo-detail-loading">Đang tải...</div>;

  return (
    <div className="combo-detail-container">
      <div className="combo-detail-content">
        <h1 className="combo-detail-title">{combo.name}</h1>
        <div className="combo-detail-body">
          <div className="markdown-content">
            <ReactMarkdown>{combo.detail}</ReactMarkdown>
          </div>
        </div>
        <div className="combo-detail-poster">
          <img
            alt={combo.name}
            src={require(`../../assets/images/Combo/${combo.ID}.jpg`)}
          />
        </div>
      </div>
    </div>
  );
}

export default ComboDetail;
