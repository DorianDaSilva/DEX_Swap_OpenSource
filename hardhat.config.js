require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("hardhat-deploy");
require("@nomiclabs/hardhat-solhint");
require("dotenv").config();

const ALCHEMY_MAINNET_RPC_URL = process.env.ALCHEMY_MAINNET_RPC_URL
const ALCHEMY_SEPOLIA_RPC_URL = process.env.ALCHEMY_SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

module.exports = {

  defaultNetwork: "hardhat",
  networks: {
      hardhat: {
          // If you want to do some forking, uncomment this
          forking: {
            url: process.env.ALCHEMY_MAINNET_RPC_URL
          }
      },
      localhost: {
          chainId: 31337,
      },
      
      Sepolia: {
          url:process.env.ALCHEMY_SEPOLIA_RPC_URL,
          accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
          //   accounts: {
          //     mnemonic: MNEMONIC,
          //   },
          saveDeployments: true,
          chainId: 11155111,
          blockConfirmations: 3,
      },
  },

  Goerli: {
    url: process.env.ALCHEMY_GOERLI_RPC_URL,
    //     mnemonic: MNEMONIC,
    //   },
    saveDeployments: true,
    chainId: 5,
    blockConfirmations: 3,
  },

  etherscan: {
      // npx hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
      apiKey: {
          goerli: ETHERSCAN_API_KEY,
          //polygon: POLYGONSCAN_API_KEY,
      },
  },
  // gasReporter: {
  //     enabled: REPORT_GAS,
  //     currency: "USD",
  //     outputFile: "gas-report.txt",
  //     noColors: true,
  //     coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  // },

  namedAccounts: {
      deployer: {
          default: 0, // here this will by default take the first account as deployer
          1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
      },
      user: {
          default: 1,
      },
  },


  solidity: {
    compilers: [
      {
        version: "0.8.18",
        settings: {},
      },
      {
        version: "0.8.11",
        settings: {},
      },
      {
        version: "0.8.0",
        settings: {},
      },
      {
        version: "0.7.6",
        settings: {},
      },
      {
        version: "0.7.5",
        settings: {},
      },
      {
        version: "0.6.0",
        settings: {},
      },

    ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

};
