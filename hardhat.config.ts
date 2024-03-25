import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";

require(`dotenv`).config();

const { DEVNET_PRIVKEY, BSCSCAN_API_KEY } = process.env;

const config: HardhatUserConfig = {
  defaultNetwork: "bnbt",
  etherscan: {
    apiKey: {
      bsc: BSCSCAN_API_KEY as string,
      bnbt: BSCSCAN_API_KEY as string,
      opbnbt: BSCSCAN_API_KEY as string,
    },
    customChains: [
      {
        network: "bnbt",
        chainId: 97,
        urls: {
          apiURL: process.env.BSCSCAN_API_URL as any,
          browserURL: process.env.BSCSCAN_BROWSER_URL as any,
        },
      },
      {
        network: "opbnbt",
        chainId: 5611,
        urls: {
          apiURL: process.env.OPBNBSCAN_API_URL as any,
          browserURL: process.env.OPBNBSCAN_BROWSER_URL as any,
        },
      },
    ],
  },
  gasReporter: {
    currency: "USD",
    enabled: process.env.REPORT_GAS ? true : false,
    excludeContracts: [],
    src: "./contracts",
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: [`0x${DEVNET_PRIVKEY}`],
      gasPrice: 20000000000000, // 20 Gwei
    },
    bnb: {
      url: process.env.L1RPC_BSC,
      accounts: [`0x${DEVNET_PRIVKEY}`],
    },
    bnbt: {
      url: process.env.L1RPC_BSCTEST,
      accounts: [`0x${DEVNET_PRIVKEY}`],
    },
    opbnb: {
      url: process.env.L2RPC_OPBNB,
      accounts: [`0x${DEVNET_PRIVKEY}`],
    },
    opbnbt: {
      url: process.env.L2RPC_OPBNBTEST,
      accounts: [`0x${DEVNET_PRIVKEY}`],
    },
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    compilers: [
      {
        version: "0.8.24",
        settings: {
          metadata: {
            bytecodeHash: "none",
          },
          // Disable the optimizer when debugging
          optimizer: {
            enabled: true,
            runs: 800,
          },
        },
      },
    ],
  },
};

export default config;
