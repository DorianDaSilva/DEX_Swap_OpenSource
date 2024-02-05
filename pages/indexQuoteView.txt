import { useState } from "react";
import PriceView from "./Price";
import QuoteView from "./Quote";
import type { PriceResponse } from "./api/types";
import { useAccount } from "wagmi";
//CONTEXT
import { Web3Button } from "@web3modal/react";
import NetworkButton from "./components/NetworkSelect/NetworkButton";

import { Web3NetworkSwitch } from "@web3modal/react";
import Sidebar from "./components/sidebar/Sidebar";
import Style from "./components/sidebar/index.module.css";
import Style2 from "./../styles/navbar.module.css";
import "./components/NetworkSelect/networkselect.module.css";

require("dotenv").config();

export default function Home() {
  const [tradeDirection, setTradeDirection] = useState("sell");
  const [finalize, setFinalize] = useState(false);
  const [price, setPrice] = useState<PriceResponse | undefined>();
  const [quote, setQuote] = useState();
  const { address } = useAccount();

  return (
    <div className="relative">
      <div className={Style.sidebar}>
        <Sidebar />
      </div>
      <div className={Style2.NavBar_box_right}>
        {/*
        NETWORK SWITCH MODAL

        <Web3NetworkSwitch />
        */}
        <NetworkButton />
        <Web3Button />
      </div>
      {/* Integrate Navbar component */}
      <main
        className={
          "flex flex-col flex-1 items-center justify-between p-24 relative z-0"
        }
      >
        {finalize && price ? (
          <QuoteView
            takerAddress={address}
            price={price}
            quote={quote}
            setQuote={setQuote}
          />
        ) : (
          <PriceView
            takerAddress={address}
            price={price}
            setPrice={setPrice}
            setFinalize={setFinalize}
          />
        )}
      </main>
    </div>
  );
}
