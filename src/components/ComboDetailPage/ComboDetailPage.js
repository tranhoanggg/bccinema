import React from "react";
import EndowList from "../EndowList/EndowList";
import ComboDetail from "../ComboDetail/ComboDetail";

function ComboDetailPage() {
  return (
    <React.Fragment>
      <ComboDetail />
      <EndowList />
    </React.Fragment>
  );
}

export default ComboDetailPage;
