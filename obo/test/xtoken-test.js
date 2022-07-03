const { expect } = require("chai");
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

    it("transfer normally when totalsupply is cap", async () => {
      const { deployer, alice, bob } = await getNamedAccounts();
      await this.token.mint(alice, BNMAX);
      let balance_alice = await this.token.balanceOf(alice);
      expect(balance_alice.eq(BNMAX)).to.be.true;
      await this.token.transfer(bob, BN100, {
        from: alice,
      });
      let balance_bob = await this.token.balanceOf(bob);
      expect(balance_bob.eq(BN100)).to.be.true;

      // burn
      await this.token.transfer(deployer, BN100, { from: bob });
      await this.token.burn(BN100);
      balance_bob = await this.token.balanceOf(bob);
      expect(balance_bob.eq(BN0));
      total_supply = await this.token.totalSupply();
      // BNMAX = TOTAL SUPPLY + BN100
      expect(total_supply.add(BN100).eq(BNMAX)).to.be.true;
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
        "ERC20Capped: cap exceeded"
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

    it("frozen account can't transfer", async () => {
      const BN82 = new BN("82");
      const { alice, bob } = await getNamedAccounts();
      await this.token.mint(alice, BN100);
      await this.token.transfer(bob, BN18, { from: alice });
      var balance = await this.token.balanceOf(bob);
      expect(balance.eq(BN18)).to.be.true;
      balance = await this.token.balanceOf(alice);
      expect(balance.eq(BN82)).to.be.true;

      // freeze
      await this.token.freeze(alice);
      await expectRevert(
        this.token.transfer(bob, BN18, { from: alice }),
        "Source account frozen"
      );
      await this.token.defrost(alice);
      await this.token.freeze(bob);
      await expectRevert(
        this.token.transfer(bob, BN18, { from: alice }),
        "Destination account frozen"
      );

      await this.token.defrost(bob);
      await this.token.transfer(bob, BN18, { from: alice });
    });

    it("freeze reverted", async () => {
      const { alice, bob } = await getNamedAccounts();
      await expectRevert(
        this.token.freeze(bob, { from: alice }),
        "Caller is not a blacklister"
      );
      await expectRevert(
        this.token.defrost(bob, { from: alice }),
        "Caller is not a blacklister"
      );
    });

    it("role grant/revoke should be admin", async () => {
      const role = web3.utils.keccak256("MINTER_ROLE");
      const { deployer, alice, bob } = await getNamedAccounts();
      await expectRevert(
        this.token.addRoleMember(role, alice, { from: bob }),
        "Caller is not a admin"
      );
      await expectRevert(
        this.token.removeRoleMember(role, alice, { from: bob }),
        "Caller is not a admin"
      );
      await expectRevert(
        this.token.grantMinter(alice, { from: bob }),
        "Caller is not a admin"
      );
      await expectRevert(
        this.token.grantBurner(alice, { from: bob }),
        "Caller is not a admin"
      );
      await expectRevert(
        this.token.grantBlacklister(alice, { from: bob }),
        "Caller is not a admin"
      );
      await expectRevert(
        this.token.revokeMinter(alice, { from: bob }),
        "Caller is not a admin"
      );
      await expectRevert(
        this.token.revokeBurner(alice, { from: bob }),
        "Caller is not a admin"
      );
      await expectRevert(
        this.token.revokeBlacklister(alice, { from: bob }),
        "Caller is not a admin"
      );
      const admin_role =
        "0x0000000000000000000000000000000000000000000000000000000000000000";
      const bob_address = `${bob}`.toLowerCase();
      await expectRevert(
        this.token.grantRole(role, alice, { from: bob }),
        `AccessControl: account ${bob_address} is missing role ${admin_role}`
      );
      await expectRevert(
        this.token.revokeRole(role, alice, { from: bob }),
        `AccessControl: account ${bob_address} is missing role ${admin_role}`
      );
    });
  });
});
