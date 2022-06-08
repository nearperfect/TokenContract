const { expect } = require("chai");
const { BN } = require("bn.js");
const { getNamedAccounts } = require("hardhat");
const XToken = artifacts.require("XToken");
const { expectRevert } = require("@openzeppelin/test-helpers");

const cap = ethers.utils.parseEther("1000000000000000000000000000");

contract("Access control", function () {
  // run only once
  before(async () => {
    await deployments.fixture(["XToken"]);
    var deployment = await deployments.get("XToken");
    this.xtoken = await XToken.at(deployment.address);
  });

  it("check access control for vault X functions", async () => {
    const { alice } = await getNamedAccounts();

    // Tests for token functions
    await expectRevert(
      this.xtoken.setCap(cap, { from: alice }),
      "Caller is not a admin"
    );

    await expectRevert(
      this.xtoken.burn(cap, { from: alice }),
      "Caller is not a burner"
    );

    await expectRevert(
      this.xtoken.burnFrom(alice, cap, { from: alice }),
      "Caller is not a burner"
    );

    await expectRevert(
      this.xtoken.pause({ from: alice }),
      "Caller is not a admin"
    );

    await expectRevert(
      this.xtoken.unpause({ from: alice }),
      "Caller is not a admin"
    );

    await expectRevert(
      this.xtoken.freeze(alice, { from: alice }),
      "Caller is not a blacklister"
    );

    await expectRevert(
      this.xtoken.defrost(alice, { from: alice }),
      "Caller is not a blacklister"
    );

    // Tests for access control functions
    const role = await this.xtoken.ADMIN_ROLE()
    await expectRevert(
      this.xtoken.addRoleMember(role, alice, { from: alice }),
      "Caller is not a admin"
    );

    await expectRevert(
      this.xtoken.removeRoleMember(role, alice, { from: alice }),
      "Caller is not a admin"
    );

    await expectRevert(
      this.xtoken.grantMinter(alice, { from: alice }),
      "Caller is not a admin"
    );

    await expectRevert(
      this.xtoken.revokeMinter(alice, { from: alice }),
      "Caller is not a admin"
    );

    await expectRevert(
      this.xtoken.grantBurner(alice, { from: alice }),
      "Caller is not a admin"
    );

    await expectRevert(
      this.xtoken.revokeBurner(alice, { from: alice }),
      "Caller is not a admin"
    );

    await expectRevert(
      this.xtoken.grantGranter(alice, {from: alice}),
      "Caller is not a admin"
    );

    await expectRevert(
      this.xtoken.revokeGranter(alice, {from: alice}),
      "Caller is not a admin"
    );

    await expectRevert(
      this.xtoken.grantBlacklister(alice, {from: alice}),
      "Caller is not a admin"
    );

    await expectRevert(
      this.xtoken.revokeBlacklister(alice, {from: alice}),
      "Caller is not a admin"
    );
  });
});