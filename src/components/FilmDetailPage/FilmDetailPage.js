import React from "react";
import EndowList from "../EndowList/EndowList";
import FilmDetail from "../FilmDetail/FilmDetail";

function FilmDetailPage() {
  return (
    <React.Fragment>
      <FilmDetail />
      <EndowList />
    </React.Fragment>
  );
}

export default FilmDetailPage;
