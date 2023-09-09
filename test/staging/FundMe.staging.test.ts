import { ethers, getNamedAccounts, network } from "hardhat";
import { developmentChains } from "../../helper-hardhat-config";
import { assert } from "chai";
import { FundMe } from "../../typechain-types";

developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", function () {
      let FundMe: FundMe, deployer;
      const FUND_AMOUNT = ethers.parseEther("0.04");
      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        FundMe = await ethers.getContract("FundMe", deployer);
      });

      it("allows people to fund and withdraw", async function () {
        (await FundMe.fund({ value: FUND_AMOUNT })).wait(1);
        const withdrawResponse = await FundMe.withdraw();
        const withdrawReceipt = await withdrawResponse.wait(1);
        // console.log(withdrawReceipt);
        const endingBalanceFundMe = await ethers.provider.getBalance(
          await FundMe.getAddress()
        );
        //console.log(endingBalanceFundMe.toString());
        assert.equal(endingBalanceFundMe.toString(), "0");
      });
    });
