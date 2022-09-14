import React from "react";

const PriceTag = (props) => {
  return (
    <div className="disButtonBase-root disChip-root makeStyles-price-23 disChip-outlined">
      <span className="disChip-label">{props.price} DCHI</span>
    </div>
  );
};

export default PriceTag;
