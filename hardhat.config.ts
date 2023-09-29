import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-gas-reporter";
import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";

//hardhat-test-coverage

const config: HardhatUserConfig = {
  solidity: {
    compilers: [{ version: "0.8.8" }, { version: "0.6.6" }],
  },
  defaultNetwork: "hardhat",
  networks: {
    //add networks for testing
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/demo",
      accounts: ["Your Private Key"],
      chainId: 11155111,
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/",
      chainId: 4,
    },
  },
  etherscan: {},
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  gasReporter: {
    enabled: true,
  },
};

export default config;
