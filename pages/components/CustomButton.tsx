import { useWeb3Modal } from "@web3modal/react";
import { useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import Style from "./../../styles/herosection.module.css"

export default function CustomButton({...props}) {
  const [loading, setLoading] = useState(false);
  const { open } = useWeb3Modal();
  const { isConnected} = useAccount();
  const { disconnect } = useDisconnect();
  const label = isConnected ? "Disconnect" : "Connect Wallet";

  async function onOpen() {
    setLoading(true);
    await open();
    setLoading(false);
  }

  function onClick() {
    if (isConnected) {
      disconnect();
    } else {
      onOpen();
    }
  }

  return (
    <button onClick={onClick} disabled={loading} className={Style.HeroSection_box_btn}>
      {loading ? "Loading..." : label}
    </button>
  );
}