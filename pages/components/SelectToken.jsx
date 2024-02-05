//SELECT TOKEN IN SEARCH BAR - TESTING
import React, { useState } from "react";
import Image from "next/image";
import {
  ETHEREUM_TOKENS
} from "@/lib/constants";
import Style from "./../../styles/navbar.module.css";
import HeroStyle from "./../../styles/herosection.module.css";

export default function SelectToken() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tokens, setTokens] = useState(
    ETHEREUM_TOKENS
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setIsOpen(true);
  };

  const filteredTokens = tokens.filter((token) => {
    return (
      token.symbol.includes(searchQuery) ||
      token.name.includes(searchQuery) ||
      token.address.includes(searchQuery)
    );
  });

  const handleTokenSelect = (token) => {
    setSelectedToken(token);
    setIsOpen(false);
    // Clear the list of filtered tokens
    setFilteredTokens([]);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search Tokens"
        className={Style.NavBar_box_middle_search}
        value={searchQuery}
        onChange={handleSearchChange}
      />

      {isOpen && (
        <ul>
          <div className={HeroStyle.HeroSection_box_input_select_token}>
            {filteredTokens.map((token) => (
              <li key={token.address}>{token.symbol}</li>
            ))}
          </div>
        </ul>
      )}
    </div>
  );
}
