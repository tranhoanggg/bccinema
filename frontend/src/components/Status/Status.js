import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import StatusSidebar from "./StatusSidebar";
import headingImg from "@/assets/images/heading.png";

const API_URL = "http://localhost:3001";

const Status = () => {
  const { id } = useParams();
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/status/${id}`)
      .then((res) => res.json())
      .then((data) => setStatus(data));
  }, [id]);

  if (!status) return null;

  return (
    <div className="status-page">
      {/* HERO */}
      <div
        className="status-hero"
        style={{ backgroundImage: `url(${headingImg})` }}
      >
        <div className="status-hero-overlay">
          <div className="breadcrumb">
            <i className="fa fa-home"></i>
            <span>Chi tiết bài viết</span>
          </div>

          <h1>{status.title}</h1>
        </div>
      </div>

      {/* CONTENT */}
      <div className="status-body container">
        <div className="status-main">
          <div className="status-meta">
            <span>{status.tag}</span>
            <span>{new Date(status.date).toLocaleDateString("vi-VN")}</span>
            <span>{status.writer}</span>
          </div>

          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              img: ({ src, alt }) => (
                <img
                  src={`${API_URL}${src}`}
                  alt={alt}
                  className="status-image"
                />
              ),
            }}
          >
            {status.content}
          </ReactMarkdown>
        </div>

        {/* SIDEBAR */}
        <StatusSidebar currentId={status.id} />
      </div>
    </div>
  );
};

export default Status;
