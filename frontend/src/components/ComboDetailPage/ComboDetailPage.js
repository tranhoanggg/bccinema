import React from "react";
import EndowList from "../EndowList/EndowList";
import ComboDetail from "../ComboDetail/ComboDetail";

function ComboDetailPage() {
  return (
    <div style={{ paddingBottom: 136 + "px" }}>
      <ComboDetail />
      <EndowList />
    </div>
  );
}

export default ComboDetailPage;
