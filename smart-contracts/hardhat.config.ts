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
      url: "https://eth.public-rpc.com",
      forking: {
        url: "https://eth.public-rpc.com"
      },
      accounts: [process.env.PRIVATE_KEY_DEPLOYER as string]
    },
    goerli: {
      chainId: 5,
      url: "https://ethereum-goerli.publicnode.com",
      forking: {
        url: "https://ethereum-goerli.publicnode.com"
      },
      accounts: [process.env.PRIVATE_KEY_DEPLOYER as string]
    },
    polygonPos: {
      chainId: 137,
      url: "https://polygon-rpc.com",
      forking: {
        url: "https://polygon-rpc.com"
      },
      accounts: [process.env.PRIVATE_KEY_DEPLOYER as string]
    },
    polygonMumbai: {
      chainId: 80001,
      url: "https://rpc-mumbai.polygon.technology",
      forking: {
        url: "https://rpc-mumbai.polygon.technology"
      },
      accounts: [process.env.PRIVATE_KEY_DEPLOYER as string]
    },
    polygonZkevm: {
      chainId: 1101,
      url: "https://polygon-rpc.com/zkevm",
      forking: {
        url: "https://polygon-rpc.com/zkevm"
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
