import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

// Configure env variables
import * as dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const config: HardhatUserConfig = {
  solidity: "0.8.21",
  networks: {
    hardhat: {
      loggingEnabled: false
    },
    ethereum: {
      chainId: 1,
      url: "https://rpc.ankr.com/eth",
      forking: {
        url: "https://rpc.ankr.com/eth"
      },
      accounts: [process.env.PRIVATE_KEY_DEPLOYER as string]
    },
    sepolia: {
      chainId: 11155111,
      url: "https://rpc.ankr.com/eth_sepolia",
      forking: {
        url: "https://rpc.ankr.com/eth_sepolia"
      },
      accounts: [process.env.PRIVATE_KEY_DEPLOYER as string]
    },
    polygonPos: {
      chainId: 137,
      url: "https://rpc.ankr.com/polygon",
      forking: {
        url: "https://rpc.ankr.com/polygon"
      },
      accounts: [process.env.PRIVATE_KEY_DEPLOYER as string]
    },
    polygonAmoy: {
      chainId: 80002,
      url: "https://rpc-amoy.polygon.technology",
      forking: {
        url: "https://rpc-amoy.polygon.technology"
      },
      accounts: [process.env.PRIVATE_KEY_DEPLOYER as string]
    },
    polygonZkevm: {
      chainId: 1101,
      url: "https://rpc.ankr.com/polygon_zkevm",
      forking: {
        url: "https://rpc.ankr.com/polygon_zkevm"
      },
      accounts: [process.env.PRIVATE_KEY_DEPLOYER as string]
    },
    polygonZkevmTestnet: {
      chainId: 2442,
      url: "https://rpc.cardona.zkevm-rpc.com",
      forking: {
        url: "https://rpc.cardona.zkevm-rpc.com"
      },
      accounts: [process.env.PRIVATE_KEY_DEPLOYER as string]
    }
  }
};

export default config;
