import { network } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains, networkConfig } from "../helper-hardhat-config";

module.exports = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments } = hre;
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;
  const { chainId } = network.config;
  const priceFeed = networkConfig[chainId];

  if (developmentChains.includes(network.name)) {
    log("development network detected, deploying mock pricefeed...");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [8, 200000000000],
    });
    log("Mock deployed!");
    log("-------------------------------------");
  }
};

module.exports.tags = ["all", "mocks"];
