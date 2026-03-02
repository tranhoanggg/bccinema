import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:3001";

const StatusSidebar = ({ currentId }) => {
  const [list, setList] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/status`)
      .then((res) => res.json())
      .then((data) => {
        const filtered = data
          .filter((item) => item.id !== currentId)
          .slice(0, 6);
        setList(filtered);
      });
  }, [currentId]);

  return (
    <aside className="status-sidebar">
      <h3>Bài viết liên quan</h3>

      {list.map((item) => (
        <Link key={item.id} to={`/status/${item.id}`} className="sidebar-item">
          <div className="sidebar-thumb">
            <img
              src={`${API_URL}/backend/uploads/posts/${item.id}/1.png`}
              alt={item.title}
            />
          </div>

          <div className="sidebar-info">
            <span className="date">
              {new Date(item.date).toLocaleDateString("vi-VN")}
            </span>
            <h4>{item.title}</h4>
          </div>
        </Link>
      ))}
    </aside>
  );
};

export default StatusSidebar;
