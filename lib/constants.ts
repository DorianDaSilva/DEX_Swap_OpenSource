import type { Address } from "wagmi";

export const MAX_ALLOWANCE =
  BigInt(
    115792089237316195423570985008687907853269984665640564039457584007913129639935n
  );

export const exchangeProxy = "0xDef1C0ded9bec7F1a1670819833240f027b25EfF";

// type Token = {
//   address: Address;
// };

interface Token {
  name: string;
  address: Address;
  symbol: string;
  decimals: number;
  chainId: number;
  logoURI: string;
}

export const ETHEREUM_TOKENS: Token[] = [
  {
    chainId: 1,
    name: "Wrapped Ether",
    symbol: "WETH",
    decimals: 18,
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
  },

  {
    chainId: 1,
    name: "Matic",
    symbol: "MATIC",
    decimals: 18,
    address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
    logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png",
  },

  {
    chainId: 1,
    name: "Wrapped Binance Coin",
    symbol: "WBNB",
    decimals: 18,
    address: "0x418D75f65a02b3D53B2418FB8E1fe493759c7605",
    logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/7192.png",
  },

  {
    chainId: 1,
    name: "Wrapped Solana",
    symbol: "WSOL",
    decimals: 9,
    address: "0xD31a59c85aE9D8edEFeC411D448f90841571b89c",
    logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/16116.png",
  },
];

export const ETHEREUM_TOKENS_BY_SYMBOL: Record<string, Token> = {
  eth: {
    chainId: 1,
    name: "Wrapped Ether",
    symbol: "WETH",
    decimals: 18,
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
  },

  matic: {
    chainId: 1,
    name: "Matic",
    symbol: "MATIC",
    decimals: 18,
    address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
    logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png",
  },

  wbnb: {
    chainId: 1,
    name: "Wrapped Binance Coin",
    symbol: "WBNB",
    decimals: 18,
    address: "0x418D75f65a02b3D53B2418FB8E1fe493759c7605",
    logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/7192.png",
  },

  wsol: {
    chainId: 1,
    name: "Wrapped Solana",
    symbol: "WSOL",
    decimals: 9,
    address: "0xD31a59c85aE9D8edEFeC411D448f90841571b89c",
    logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/16116.png",
  },
};

export const ETHEREUM_TOKENS_BY_ADDRESS: Record<string, Token> = {
  "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2": {
    chainId: 1,
    name: "Wrapped Ether",
    symbol: "WETH",
    decimals: 18,
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
  },

  "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0": {
    chainId: 1,
    name: "Matic",
    symbol: "MATIC",
    decimals: 18,
    address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
    logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png",
  },

  "0x418D75f65a02b3D53B2418FB8E1fe493759c7605": {
    chainId: 1,
    name: "Wrapped Binance Coin",
    symbol: "WBNB",
    decimals: 18,
    address: "0x418D75f65a02b3D53B2418FB8E1fe493759c7605",
    logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/7192.png",
  },

  "0xD31a59c85aE9D8edEFeC411D448f90841571b89c": {
    chainId: 1,
    name: "Wrapped Solana",
    symbol: "WSOL",
    decimals: 9,
    address: "0xD31a59c85aE9D8edEFeC411D448f90841571b89c",
    logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/16116.png",
  },
};
