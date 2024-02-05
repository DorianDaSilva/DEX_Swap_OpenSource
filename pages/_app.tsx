import "./../styles/globals.css";

import type { AppProps } from "next/app";
import { useEffect, useState, useRef } from "react";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";

import SelectToken from "./components/SelectToken";

import {
  mainnet,
  bsc,
  polygon
} from "wagmi/chains";
require("dotenv").config();


//walletconnect
const projectId = "PROJECT_ID";

const chains = [
  mainnet,
  bsc,
  polygon,
];

export const { publicClient } = configureChains(chains, [
  w3mProvider({ projectId }),
]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});

const ethereumClient = new EthereumClient(wagmiConfig, chains);

export default function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
      <div className="flex-row">
        <WagmiConfig config={wagmiConfig}>
          {mounted && <Component {...pageProps} />}
        </WagmiConfig>

        <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
      </div>
  );
}
