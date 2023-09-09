import { ethers, getNamedAccounts } from "hardhat";

async function Fund() {
  const { deployer } = await getNamedAccounts();
  const FundMe = await ethers.getContract("FundMe", deployer);
  console.log("Funding...");
  const withdrawResponse = await FundMe.withdraw();
  await withdrawResponse.wait(1);
  console.log("Got it back...");
}

Fund().then(() => process.exit(0));
