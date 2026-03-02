import React from "react";
import EndowList from "../EndowList/EndowList";
import FilmDetail from "../FilmDetail/FilmDetail";

function FilmDetailPage() {
  return (
    <div style={{ paddingBottom: 136 + "px" }}>
      <FilmDetail />
      <EndowList />
    </div>
  );
}

export default FilmDetailPage;
