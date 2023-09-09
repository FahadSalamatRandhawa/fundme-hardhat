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
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/demo",
      accounts: [
        "68d8ed1e1e38c44a74d5c8b5590ddb36eef074324e45ff1e7c8eeebc01f25977",
      ],
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
};

export default config;
