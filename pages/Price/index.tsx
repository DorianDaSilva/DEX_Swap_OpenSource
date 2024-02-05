import qs from "qs";
import useSWR from "swr";
import CustomButton from "../components/CustomButton";
import {
  ArrowDownOutlined,
  DownOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Modal, message } from "antd";

import { useState, ChangeEvent, SetStateAction } from "react";
import { formatUnits, parseUnits } from "ethers";
import {
  erc20ABI,
  useContractRead,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useBalance,
  type Address,
} from "wagmi";
import {
  ETHEREUM_TOKENS,
  ETHEREUM_TOKENS_BY_SYMBOL,
  ETHEREUM_TOKENS_BY_ADDRESS,
  MAX_ALLOWANCE,
  exchangeProxy,
} from "../../lib/constants";
import Style from "../../styles/herosection.module.css";

interface PriceRequestParams {
  sellToken: string;
  buyToken: string;
  buyAmount?: string;
  sellAmount?: string;
  takerAddress?: string;
}

const AFFILIATE_FEE = 0.1; // Percentage of the buyAmount that should be attributed to feeRecipient as affiliate fees
const FEE_RECIPIENT = "0x75A94931B81d81C7a62b76DC0FcFAC77FbE1e917"; // The ETH address that should receive affiliate fees

export const fetcher = ([endpoint, params]: [string, PriceRequestParams]) => {
  const { sellAmount, buyAmount } = params;
  if (!sellAmount && !buyAmount) return;
  const query = qs.stringify(params);

  return fetch(`${endpoint}?${query}`).then((res) => res.json());
};

export default function PriceView({
  price,
  setPrice,
  setFinalize,
  takerAddress,
}: {
  price: any;
  setPrice: (price: any) => void;
  setFinalize: (finalize: boolean) => void;
  takerAddress: Address | undefined;
}) {
  // fetch price here
  const [sellAmount, setSellAmount] = useState("");
  const [buyAmount, setBuyAmount] = useState("");
  const [tradeDirection, setTradeDirection] = useState("sell");
  const [sellToken, setSellToken] = useState("matic");
  const [buyToken, setBuyToken] = useState("eth");

  //modal state
  const [isOpen, setIsOpen] = useState(false);
  const [changeToken, setChangeToken] = useState(1);
  const [asset, setAsset] = useState("");

  function switchTokens() {
    const tempSellToken = sellToken;
    setSellToken(buyToken);
    setBuyToken(tempSellToken);
  }

  const sellTokenDecimals = ETHEREUM_TOKENS_BY_SYMBOL[sellToken].decimals;

  console.log(sellAmount, sellTokenDecimals, "<-");
  const parsedSellAmount =
    sellAmount && tradeDirection === "sell"
      ? parseUnits(sellAmount, sellTokenDecimals).toString()
      : undefined;

  const buyTokenDecimals = ETHEREUM_TOKENS_BY_SYMBOL[buyToken].decimals;

  const parsedBuyAmount =
    buyAmount && tradeDirection === "buy"
      ? parseUnits(buyAmount, buyTokenDecimals).toString()
      : undefined;

  const { isLoading: isLoadingPrice } = useSWR(
    [
      "/api/price",
      {
        sellToken: ETHEREUM_TOKENS_BY_SYMBOL[sellToken].address,
        buyToken: ETHEREUM_TOKENS_BY_SYMBOL[buyToken].address,
        sellAmount: parsedSellAmount,
        buyAmount: parsedBuyAmount,
        takerAddress,
        feeRecipient: FEE_RECIPIENT,
        buyTokenPercentageFee: AFFILIATE_FEE,
      },
    ],
    fetcher,
    {
      onSuccess: (data) => {
        setPrice(data);
        if (tradeDirection === "sell") {
          console.log(formatUnits(data.buyAmount, buyTokenDecimals), data);
          setBuyAmount(formatUnits(data.buyAmount, buyTokenDecimals));
        } else {
          setSellAmount(formatUnits(data.sellAmount, sellTokenDecimals));
        }
      },
    }
  );

  const { data, isError, isLoading } = useBalance({
    address: takerAddress,
    token: ETHEREUM_TOKENS_BY_SYMBOL[sellToken].address,
  });

  console.log(sellAmount);

  const disabled =
    data && sellAmount
      ? parseUnits(sellAmount, sellTokenDecimals) > data.value
      : true;

  console.log(data, isError, isLoading);

  function openModal(token: string): void {
    if (token === "sellToken") {
      setChangeToken(1);
    } else if (token === "buyToken") {
      setChangeToken(2);
    }
    setIsOpen(true);
  }

  // tokenChoice component
  const TokenChoice = ({
    token,
    i,
    changeToken,
  }: {
    token: ETHEREUM_TOKENS;
    i: number;
    changeToken: number;
  }) => {
    return (
      <div
        className={Style.tokenChoice}
        key={i}
        onClick={() => modifyToken(i, changeToken)}
      >
        <img
          src={token.logoURI}
          alt={token.logoURI}
          className={Style.tokenLogo}
        />
        <div className="tokenChoiceNames">
          <div className={Style.tokenName}>{token.name}</div>
          <div className={Style.tokenTicker}>{token.symbol}</div>
        </div>
      </div>
    );
  };

  function modifyToken(i: number, changeToken: number) {
    if (changeToken === 1) {
      setSellToken(ETHEREUM_TOKENS[i].symbol.toLowerCase());
    } else if (changeToken === 2) {
      setBuyToken(ETHEREUM_TOKENS[i].symbol.toLowerCase());
    }
    setIsOpen(false);
  }

  return (
    <>
      {/* MODAL */}
      <Modal
        open={isOpen}
        footer={null}
        onCancel={() => setIsOpen(false)}
        title="Select a token" //Modify: "select a ${network.name} token"
      >
        <div className={Style.modalContent}>
          <input
            type="text"
            value={asset}
            onChange={(e) => setAsset(e.target.value)}
            placeholder="Search Token"
            className={Style.Modal_input}
          />
          <div className={Style.tokenChoiceWrapper}>
            <ul>
              {ETHEREUM_TOKENS?.filter((token) => {
                return (
                  token.symbol.includes(asset) ||
                  token.name.includes(asset) ||
                  token.address.includes(asset)
                );
              }).map((token, i) => {
                return (
                  <TokenChoice
                    key={i}
                    token={token}
                    i={i}
                    changeToken={changeToken}
                  />
                );
              })}
            </ul>
          </div>
        </div>
      </Modal>

      {/* BOX */}

      <div className={Style.HeroSection_box}>
        <div className={Style.HeroSection_box_heading}>
          <p>Swap</p>
        </div>

        <div className="flex-col">
          {/* Sell side */}
          <section className={Style.HeroSection_box_input}>
            <label htmlFor="sell-select" className="sr-only"/>

            {/* placeholder */}
            <label htmlFor="sell-amount" className="sr-only"/>
            <input
              id="sell-amount"
              value={sellAmount}
              className={Style.HeroSection_box_input_input}
              style={{ border: "1px solid black" }}
              onChange={(e) => {
                setTradeDirection("sell");
                setSellAmount(e.target.value);
              }}
            />

            {/* Token selection */}
            <button
              className={Style.HeroSection_box_input_button}
              onClick={() => {
                openModal("sellToken");
              }}
            >
              {/* image */}
              <div className={Style.HeroSection_box_input_image_container}>
                <img
                  alt={sellToken}
                  className={Style.HeroSection_box_input_image}
                  src={ETHEREUM_TOKENS_BY_SYMBOL[sellToken].logoURI}
                />
              </div>
              <span className={Style.HeroSection_box_input_select}>
                <option value={sellToken}>
                  {ETHEREUM_TOKENS_BY_SYMBOL[sellToken].symbol}
                </option>
              </span>
            </button>
          </section>

          {/* End of sell side */}

          <section className={Style.HeroSection_box_input}>
            <label htmlFor="buy-token" className="sr-only"></label>

            {/* placeholder */}
            <label htmlFor="buy-amount" className="sr-only"></label>
            <input
              id="buy-amount"
              value={buyAmount}
              className={`${Style.HeroSection_box_input_input} cursor-not-allowed`}
              style={{ border: "1px solid black" }}
              disabled
              onChange={(e) => {
                setTradeDirection("buy");
                setBuyAmount(e.target.value);
              }}
            />

            {/* Token selection */}
            <button
              className={Style.HeroSection_box_input_button}
              onClick={() => openModal("buyToken")}
            >
              {/* image */}
              <div className={Style.HeroSection_box_input_image_container}>
                <img
                  alt={buyToken}
                  className={Style.HeroSection_box_input_image}
                  src={ETHEREUM_TOKENS_BY_SYMBOL[buyToken].logoURI}
                />
              </div>
              <span className={Style.HeroSection_box_input_select}>
                <option value={buyToken}>
                  {ETHEREUM_TOKENS_BY_SYMBOL[buyToken].symbol}
                </option>
              </span>
            </button>
          </section>
          {/* End of buy section */}

          {/*SWITCH TOKEN BUTTON*/}
          <button className={Style.switchButton} onClick={switchTokens}>
            <ArrowDownOutlined className={Style.ArrowDownOutlined} />
          </button>
        </div>

        {/* END OF BOX */}

        <div className={Style.transactionFee_box}>
          <div className={Style.transactionFee}>
            {price && price.grossBuyAmount
              ? "Transaction Fee: " +
                Number(
                  formatUnits(
                    BigInt(price.grossBuyAmount),
                    ETHEREUM_TOKENS_BY_SYMBOL[buyToken].decimals
                  )
                ) *
                  AFFILIATE_FEE +
                " " +
                ETHEREUM_TOKENS_BY_SYMBOL[buyToken].symbol
              : null}
          </div>
        </div>

        {takerAddress ? (
          <ApproveOrReviewButton
            sellTokenAddress={ETHEREUM_TOKENS_BY_SYMBOL[sellToken].address}
            takerAddress={takerAddress}
            onClick={() => {
              setFinalize(true);
            }}
            disabled={disabled}
          />
        ) : (
          <CustomButton>
            {({
              isConnected,
              isConnecting,
              show,
              hide,
              address,
              ensName,
              chain,
            }: {
              isConnected: boolean;
              isConnecting: boolean;
              show: () => void;
              hide: () => void;
              address: string;
              ensName: string;
              chain: {
                name: string;
                id: number;
              };
            }) => {
              return (
                <button onClick={show} type="button">
                  {isConnected ? (
                    <div>
                      <p>Connected to {chain.name}</p>
                      <p>Address: {address}</p>
                      <p>ENS Name: {ensName}</p>
                    </div>
                  ) : (
                    <button onClick={show}>Connect Wallet</button>
                  )}
                </button>
              );
            }}
          </CustomButton>
        )}
      </div>

      {isLoadingPrice && (
        <div className="text-center mt-2">Fetching the best price...</div>
      )}
    </>
  );
}

function ApproveOrReviewButton({
  takerAddress,
  onClick,
  sellTokenAddress,
  disabled,
}: {
  takerAddress: Address;
  onClick: () => void;
  sellTokenAddress: Address;
  disabled?: boolean;
}) {
  // 1. Read from erc20, does spender (0x Exchange Proxy) have allowance?
  const { data: allowance, refetch } = useContractRead({
    address: sellTokenAddress,
    abi: erc20ABI,
    functionName: "allowance",
    args: [takerAddress, exchangeProxy],
  });

  // 2. (only if no allowance): write to erc20, approve 0x Exchange Proxy to spend max integer
  const { config } = usePrepareContractWrite({
    address: sellTokenAddress,
    abi: erc20ABI,
    functionName: "approve",
    args: [exchangeProxy, MAX_ALLOWANCE],
  });

  const {
    data: writeContractResult,
    writeAsync: approveAsync,
    error,
  } = useContractWrite(config);

  const { isLoading: isApproving } = useWaitForTransaction({
    hash: writeContractResult ? writeContractResult.hash : undefined,
    onSuccess(data) {
      refetch();
    },
  });

  if (error) {
    return <div>Something went wrong: {error.message}</div>;
  }

  if (allowance === 0n && approveAsync) {
    return (
      <>
        <button
          type="button"
          className={Style.HeroSection_box_btn}
          // className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
          onClick={async () => {
            const writtenValue = await approveAsync();
          }}
        >
          {isApproving ? "Approving…" : "Approve"}
        </button>
      </>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      // className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full disabled"
      className={Style.HeroSection_box_btn}
    >
      {disabled ? "Insufficient Balance" : "Review Trade"}
    </button>
  );
}
