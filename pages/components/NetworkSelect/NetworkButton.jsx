import React, { useState } from "react";
import NetworkSelect from "./NetworkSelect";



const NetworkButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className="styled-element"
        onClick={handleClick}
      >
        <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png"
        className="button_logo"
        /> ETH
      </button>

      {isOpen && <NetworkSelect onClose={handleClose} />}
    </>
  );
};

export default NetworkButton;
