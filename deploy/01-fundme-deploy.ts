import { network, run } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains, networkConfig } from "../helper-hardhat-config";

module.exports = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments, run } = hre;
  const { deployer } = await getNamedAccounts();
  const { deploy, log, get } = deployments;
  const { chainId } = network.config;
  let priceFeed;

  if (developmentChains.includes(network.name)) {
    const MockPriceFeed = await get("MockV3Aggregator");
    priceFeed = MockPriceFeed.address;
  } else {
    priceFeed = networkConfig[chainId].ethUSDPriceFeed;
  }

  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [priceFeed],
    log: true,
    waitConfirmations: 1,
  });
  console.log(fundMe.address);
};

module.exports.tags = ["all", "deploy"];
