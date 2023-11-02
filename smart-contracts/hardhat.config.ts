import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.21",
  networks: {
    hardhat: {
      loggingEnabled: false
    },
    polygonPos: {
      chainId: 137,
      url: "https://rpc.ankr.com/polygon",
      forking: {
        url: "https://rpc.ankr.com/polygon"
      }
    },
    polygonMumbai: {
      chainId: 80001,
      url: "https://rpc.ankr.com/polygon_mumbai",
      forking: {
        url: "https://rpc.ankr.com/polygon_mumbai"
      }
    },
    polygonZkevm: {
      chainId: 1101,
      url: "https://rpc.ankr.com/polygon_zkevm",
      forking: {
        url: "https://rpc.ankr.com/polygon_zkevm"
      }
    },
    polygonZkevmTestnet: {
      chainId: 1442,
      url: "https://rpc.public.zkevm-test.net",
      forking: {
        url: "https://rpc.public.zkevm-test.net"
      }
    }
  }
};

export default config;
