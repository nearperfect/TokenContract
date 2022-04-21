const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BN } = require("bn.js");
const { getNamedAccounts } = require("hardhat");
const XToken = artifacts.require("XToken");
const {
  shouldSupportInterfaces,
} = require("./helpers/SupportsInterface.behavior");
const { expectRevert } = require("@openzeppelin/test-helpers");
const BN0 = new BN("0");
const BN18 = new BN("18");
const BN100 = new BN("100");
const BNMAX = new BN("1000000000000000000000000000");

contract("XToken", function () {
  beforeEach(async () => {
    await deployments.fixture(["XToken"]);
    var deployment = await deployments.get("XToken");
    this.token = await XToken.at(deployment.address);
  });

  // check interfaces support
  shouldSupportInterfaces(["ERC165", "ERC20"]);

  describe("sanity check ERC20 functionality", () => {
    it("name symbol and totalSupply", async () => {
      expect(await this.token.name()).to.equal("Geodnet Token");
      expect(await this.token.symbol()).to.equal("GEOD");
      const BNcap = BNMAX;
      const totalSupply = await this.token.totalSupply();
      expect(totalSupply.eq(BN0)).to.be.true;
      const decimals = await this.token.decimals();
      expect(decimals.eq(BN18)).to.be.true;
      const cap = await this.token.cap();
      expect(cap.eq(BNcap)).to.be.true;
    });

    it("mint normally", async () => {
      const { alice } = await getNamedAccounts();
      const tx = await this.token.mint(alice, BN100);
      const balance = await this.token.balanceOf(alice);
      expect(balance.eq(BN100)).to.be.true;
      const totalSupply = await this.token.totalSupply();
      expect(totalSupply.eq(BN100)).to.be.true;
    });

    it("mint reverted", async () => {
      const { alice } = await getNamedAccounts();
      await expectRevert(
        this.token.mint(alice, BN100, { from: alice }),
        "Caller is not a minter"
      );
    });

    it("burn normally", async () => {
      const { deployer } = await getNamedAccounts();
      await this.token.mint(deployer, BN100);
      const totalSupplyBefore = await this.token.totalSupply();
      expect(totalSupplyBefore.eq(BN100)).to.be.true;
      await this.token.burn(BN100);
      const totalSupplyAfter = await this.token.totalSupply();
      expect(totalSupplyAfter.eq(BN0)).to.be.true;
    });

    it("burnFrom normally", async () => {
      const { deployer, alice } = await getNamedAccounts();
      await this.token.mint(alice, BN100);
      await this.token.approve(deployer, BN100, { from: alice });
      await this.token.burnFrom(alice, BN100);
      const totalSupplyAfter = await this.token.totalSupply();
      expect(totalSupplyAfter.eq(BN0)).to.be.true;
    });

    it("burnFrom revert", async () => {
      const { alice, bob } = await getNamedAccounts();
      await this.token.mint(alice, BN100);
      await expectRevert(
        this.token.burnFrom(alice, BN100, { from: bob }),
        "Caller is not a burner"
      );
      await expectRevert(
        this.token.burnFrom(alice, BN100),
        "ERC20: insufficient allowance"
      );
    });

    it("burn reverted", async () => {
      const { alice } = await getNamedAccounts();
      await this.token.mint(alice, BN100);
      await expectRevert(
        this.token.burn(BN100, { from: alice }),
        "Caller is not a burner"
      );
    });

    it("mint no more", async () => {
      const { alice } = await getNamedAccounts();
      await this.token.mint(alice, BNMAX);
      await expectRevert(
        this.token.mint(alice, BN100),
        "ERC20 Capped: cap exceeded"
      );
    });

    it("set cap normally", async () => {
      const BNMAXPLUS = new BN("2000000000000000000000000000");
      await this.token.setCap(BNMAXPLUS);
    });

    it("set cap revert", async () => {
      const { alice } = await getNamedAccounts();
      const BNMAXPLUS = new BN("2000000000000000000000000000");
      await expectRevert(
        this.token.setCap(BNMAXPLUS, { from: alice }),
        "Caller is not a admin"
      );
    });

    it("set cap too low", async () => {
      const { alice } = await getNamedAccounts();
      await this.token.mint(alice, BNMAX);
      await expectRevert(
        this.token.setCap(BN100),
        "ERC20: new cap should be larger than total supply"
      );
    });

    it("pause normally", async () => {
      const { alice } = await getNamedAccounts();
      await this.token.pause();
      await expectRevert(this.token.mint(alice, BN100), "Pausable: paused");
      await this.token.unpause();
      await this.token.mint(alice, BN100);
    });

    it("pause revert", async () => {
      const { alice } = await getNamedAccounts();
      await expectRevert(
        this.token.pause({ from: alice }),
        "Caller is not a admin"
      );
      await expectRevert(
        this.token.unpause({ from: alice }),
        "Caller is not a admin"
      );
    });
  });
});
