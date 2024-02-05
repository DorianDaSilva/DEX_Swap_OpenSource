import useSWR from "swr";
import Image from "next/image";
import {
  ETHEREUM_TOKENS,
  ETHEREUM_TOKENS_BY_SYMBOL,
  ETHEREUM_TOKENS_BY_ADDRESS,
} from "../../lib/constants";
import { fetcher } from "../Price/index";
import type { PriceResponse, QuoteResponse } from "../api/types";
import { formatUnits } from "ethers";
import {
  useAccount,
  useSendTransaction,
  usePrepareSendTransaction,
  type Address,
} from "wagmi";
import Style from "../../styles/herosection.module.css";

const AFFILIATE_FEE = 0.1; // Percentage of the buyAmount that should be attributed to feeRecipient as affiliate fees
const FEE_RECIPIENT = "0x75A94931B81d81C7a62b76DC0FcFAC77FbE1e917"; // The ETH address that should receive affiliate fees

export default function QuoteView({
  price,
  // quote,
  setQuote,
  takerAddress,
}: {
  price: PriceResponse;
  quote: QuoteResponse | undefined;
  setQuote: (price: any) => void;
  takerAddress: Address | undefined;
}) {
  const sellTokenInfo =
    ETHEREUM_TOKENS_BY_ADDRESS[price.sellTokenAddress] || {};

  const buyTokenInfo = ETHEREUM_TOKENS_BY_ADDRESS[price.buyTokenAddress] || {};

  // fetch quote here
  const { address } = useAccount();

  const { data: quote, isLoading: isLoadingPrice } = useSWR(
    [
      "/api/quote",
      {
        sellToken: price.sellTokenAddress,
        buyToken: price.buyTokenAddress,
        sellAmount: price.sellAmount,
        // buyAmount: TODO if we want to support buys,
        address: takerAddress,
        feeRecipient: FEE_RECIPIENT,
        buyTokenPercentageFee: AFFILIATE_FEE,
      },
    ],
    fetcher,
    {
      onSuccess: (data) => {
        setQuote(data);
        console.log("quote", data);
        console.log(formatUnits(data.buyAmount, buyTokenInfo.decimals), data);
      },
    }
  );

  const { config } = usePrepareSendTransaction({
    to: quote?.to, // The address of the contract to send call data to, in this case 0x Exchange Proxy
    data: quote?.data, // The call data required to be sent to the to contract address.
  });

  const { sendTransaction } = useSendTransaction(config);

  if (!quote) {
    return <div>Getting best quote...</div>;
  }

  console.log("quote", quote);
  console.log(formatUnits(quote.sellAmount, sellTokenInfo.decimals));

  return (
    <div className={Style.HeroSection_box_Quote}>
      <form>
        {/* SELL SIDE */}
        <div className={Style.HeroSection_box_Quote_heading}>You pay</div>

        <div className={Style.HeroSection_box_input_Quote}>
          <div className="flex-shrink-0 rounded-full border-2 border-red-500 bg-gray-200 p-2 w-25">
            <img
              alt="token logo"
              className="h-9 w-9 rounded-full"
              src={sellTokenInfo.logoURI}
            />
          </div>

          <div className={Style.HeroSection_box_input_Quote_select}>
            {sellTokenInfo.symbol}
          </div>

          <div className={Style.HeroSection_box_input_Quote_input}>
            <div className="flex items-center p-[0.25rem] text-lg sm:text-3xl text-white">
              <span>
                {formatUnits(quote.sellAmount, sellTokenInfo.decimals)}
              </span>
            </div>
          </div>
        </div>

        {/* BUY SIDE */}
        <div className={Style.HeroSection_box_Quote_heading}>You receive</div>

        <div className={Style.HeroSection_box_input_Quote}>
          <div className="flex-shrink-0 rounded-full border-2 border-red-500 bg-gray-200 p-2 w-25">
            <img
              alt="token logo"
              className="h-9 w-9 rounded-full"
              src={buyTokenInfo.logoURI}
            />
          </div>

          <div className={Style.HeroSection_box_input_Quote_select}>
            {buyTokenInfo.symbol}
          </div>

          <div className={Style.HeroSection_box_input_Quote_input}>
            <div className="flex items-center p-[0.25rem] text-lg sm:text-3xl text-white">
              <span>{formatUnits(quote.buyAmount, buyTokenInfo.decimals)}</span>
            </div>
          </div>
        </div>

        <div className={Style.transactionFee_box}>
          <div className="text-slate-400">
            {quote && quote.grossBuyAmount
              ? "Transaction Fee: " +
                Number(
                  formatUnits(
                    BigInt(quote.grossBuyAmount),
                    buyTokenInfo.decimals
                  )
                ) *
                  AFFILIATE_FEE +
                " " +
                buyTokenInfo.symbol
              : null}
          </div>
        </div>
      </form>

      <button
        className={Style.HeroSection_box_btn}
        onClick={() => {
          console.log("submitting quote to blockchain");
          sendTransaction && sendTransaction();
        }}
      >
        Place Order
      </button>
    </div>
  );
}
