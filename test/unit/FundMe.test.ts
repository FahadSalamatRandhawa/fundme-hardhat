import { assert, expect } from "chai";
import { deployments, ethers, getNamedAccounts, network } from "hardhat";
import { developmentChains } from "../../helper-hardhat-config";

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Fund Me", function () {
      console.log(network.name);
      let FundMe, deployer, MockV3Aggregator;
      const FUND_AMOUNT = ethers.parseEther("0.5");
      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        FundMe = await ethers.getContract("FundMe", deployer);
        MockV3Aggregator = await ethers.getContract(
          "MockV3Aggregator",
          deployer
        );
      });

      describe("constructor", async function () {
        it("sets correct aggregator address", async function () {
          const priceFeed = await FundMe.priceFeed();

          assert.equal(priceFeed, MockV3Aggregator.target);
        });
      });

      describe("Fund", async () => {
        it("fails if u don't send eth", async () => {
          await expect(FundMe.fund()).to.be.reverted;
        });
        it("updates the amount of eth", async () => {
          const valueBeforeUpdate = await FundMe.AmountToAddress(deployer);
          // console.log(valueBeforeUpdate.toString());
          await FundMe.fund({ value: FUND_AMOUNT });
          const valueAfterUpdate = await FundMe.AmountToAddress(deployer);
          // console.log(valueAfterUpdate.toString());
          assert.equal(
            FUND_AMOUNT.toString(),
            (valueAfterUpdate - valueBeforeUpdate).toString()
          );
        });
        it("adds funder to funders array", async () => {
          await FundMe.fund({ value: FUND_AMOUNT });
          assert.equal(await FundMe.funders(0), deployer);
        });
      });

      describe("withdraw", async () => {
        beforeEach(async () => {
          await FundMe.fund({ value: FUND_AMOUNT });
        });

        it("withdraw ETH from single funder", async () => {
          //console.log(ethers.version);  //ethers version 6.4
          const startingBalanceForFundMe = await ethers.provider.getBalance(
            await FundMe.getAddress()
          );
          // console.log(
          //   "starting balance for contract in wei " +
          //     startingBalanceForFundMe.toString()
          // );
          const startingBlanaceForDeployer = await ethers.provider.getBalance(
            deployer
          );
          // console.log(
          //   "starting balance for deployer in wei " +
          //     startingBlanaceForDeployer.toString()
          // );
          const withdrawResponse = await FundMe.withdraw();
          const withdrawReceipt = await withdrawResponse.wait(1);
          const { gasPrice, gasUsed } = withdrawReceipt;
          const gasCost = gasPrice * gasUsed;

          const endingBalanceForFundMe = await ethers.provider.getBalance(
            await FundMe.getAddress()
          );
          const endingBalanceForDeployer = await ethers.provider.getBalance(
            deployer
          );
          assert.equal(endingBalanceForFundMe.toString(), (0).toString());
          assert.equal(
            startingBalanceForFundMe + startingBlanaceForDeployer,
            endingBalanceForDeployer + BigInt(gasCost)
          );
        });
        it("withdraw with multiple funders", async () => {
          const accounts = await ethers.getSigners();
          for (let i = 1; i < 8; i++) {
            const fundMeConnectedContract = await FundMe.connect(accounts[i]);
            await fundMeConnectedContract.fund({ value: FUND_AMOUNT });
          }
          const startingBalanceForFundMe = await ethers.provider.getBalance(
            await FundMe.getAddress()
          );
          // console.log(
          //   "starting balance in wei : " + startingBalanceForFundMe.toString()
          // );
          const startingBlanaceForDeployer = await ethers.provider.getBalance(
            deployer
          );
          const withdrawResponse = await FundMe.withdraw();
          const withdrawReceipt = await withdrawResponse.wait(1);
          const { gasPrice, gasUsed } = withdrawReceipt;
          const gasCost = gasPrice * gasUsed;

          const endingBalanceForFundMe = await ethers.provider.getBalance(
            await FundMe.getAddress()
          );
          const endingBalanceForDeployer = await ethers.provider.getBalance(
            deployer
          );

          //checking values
          assert.equal(endingBalanceForFundMe.toString(), (0).toString());
          assert.equal(
            startingBalanceForFundMe + startingBlanaceForDeployer,
            endingBalanceForDeployer + BigInt(gasCost)
          );
          await expect(FundMe.funders(0)).to.be.reverted;
          for (let i = 1; i < 8; i++) {
            assert.equal(await FundMe.AmountToAddress(accounts[i].address), 0);
          }
        });
        it("only allows owner to withdraw", async () => {
          const accounts = await ethers.getSigners();
          const attacker = accounts[3];
          const attackerConnectedWallet = await FundMe.connect(attacker);
          await expect(attackerConnectedWallet.withdraw()).to.be.reverted;
        });
      });
    });
