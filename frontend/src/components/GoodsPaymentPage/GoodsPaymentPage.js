import React from "react";
import EndowList from "../EndowList/EndowList";
import GoodsPayment from "../GoodsPayment/GoodsPayment";

function GoodsPaymentPage() {
  return (
    <React.Fragment>
      <GoodsPayment />
      <EndowList />
    </React.Fragment>
  );
}

export default GoodsPaymentPage;
