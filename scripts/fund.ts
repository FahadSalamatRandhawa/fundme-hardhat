import { ethers, getNamedAccounts } from "hardhat";

async function Fund() {
  const { deployer } = await getNamedAccounts();
  const FundMe = await ethers.getContract("FundMe", deployer);
  console.log("Funding...");
  await FundMe.fund({ value: ethers.parseEther("0.4") });
}

Fund().then(() => process.exit(0));
