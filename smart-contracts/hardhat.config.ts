import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

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
    goerli: {
      chainId: 5,
      url: "https://rpc.ankr.com/eth_goerli",
      forking: {
        url: "https://rpc.ankr.com/eth_goerli"
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
    polygonMumbai: {
      chainId: 80001,
      url: "https://rpc.ankr.com/polygon_mumbai",
      forking: {
        url: "https://rpc.ankr.com/polygon_mumbai"
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
      chainId: 1442,
      url: "https://rpc.public.zkevm-test.net",
      forking: {
        url: "https://rpc.public.zkevm-test.net"
      },
      accounts: [process.env.PRIVATE_KEY_DEPLOYER as string]
    }
  }
};

export default config;
