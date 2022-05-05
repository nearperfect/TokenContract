const { expect } = require("chai");
const { ethers } = require("hardhat");
const { expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const { BigNumber } = require("ethers");

const BN0 = new BigNumber.from("0");
const BN18 = new BigNumber.from("18");
const BN100 = new BigNumber.from("100");
const BN1B = new BigNumber.from("1000000000");
const BNMAX = new BigNumber.from("1000000000000000000000000000");

contract("TokenVesting", function () {
  let xToken;
  let tokenVesting;
  let currentTime;
  let deployer;
  let owner;
  let alice;
  let bob;
  let charlie;
  let darwin;

  beforeEach(async () => {
    [deployer, owner, alice, bob, charlie, darwin] = await ethers.getSigners();
    const XToken = await ethers.getContractFactory("XToken");
    xToken = await XToken.deploy("Test coin", "TCOIN", BNMAX);
    await xToken.mint(alice.address, BN1B);

    const TokenVesting = await ethers.getContractFactory("TokenVesting");
    tokenVesting = await TokenVesting.deploy(xToken.address, alice.address);
    await xToken.connect(alice).approve(tokenVesting.address, BN1B);

    currentTime = Math.floor(new Date() / 1000);
    await tokenVesting.newVestingSched("vesting 1 month", currentTime);
    await tokenVesting.newVestingSched("vesting 3 month", currentTime);
    await tokenVesting.newVestingSched("vesting 6 month", currentTime);
  });

  describe("token vesting schedule functionality", () => {
    it("create new vesting schedule", async () => {
      currentTime = Math.floor(new Date() / 1000);
      const receipt = await tokenVesting.newVestingSched(
        "vesting 12 month",
        currentTime
      );
      expect(receipt)
        .to.emit(tokenVesting, "Vesting")
        .withArgs("vesting 12 month", currentTime);
      const id = await tokenVesting.vestingSchedID();
      expect(id).to.be.equal(4);

      const vestingScheds = await tokenVesting.allVestingScheds();
      expect(vestingScheds[0].id).to.equal(0);
      expect(vestingScheds[0].name).to.equal("vesting 1 month");
      expect(vestingScheds[0].vestingTime).to.equal(currentTime);
      expect(vestingScheds[0].grantAmount).to.equal(0);
      expect(vestingScheds[0].withdrawAmount).to.equal(0);
      expect(vestingScheds[1].id).to.equal(1);
      expect(vestingScheds[1].name).to.equal("vesting 3 month");
      expect(vestingScheds[1].vestingTime).to.equal(currentTime);
      expect(vestingScheds[1].grantAmount).to.equal(0);
      expect(vestingScheds[1].withdrawAmount).to.equal(0);
      expect(vestingScheds[2].id).to.equal(2);
      expect(vestingScheds[2].name).to.equal("vesting 6 month");
      expect(vestingScheds[2].vestingTime).to.equal(currentTime);
      expect(vestingScheds[2].grantAmount).to.equal(0);
      expect(vestingScheds[2].withdrawAmount).to.equal(0);
      expect(vestingScheds[3].id).to.equal(3);
      expect(vestingScheds[3].name).to.equal("vesting 12 month");
      expect(vestingScheds[3].vestingTime).to.equal(currentTime);
      expect(vestingScheds[3].grantAmount).to.equal(0);
      expect(vestingScheds[3].withdrawAmount).to.equal(0);
    });

    it("grant new vesting", async () => {
      const receipt0 = await tokenVesting.grant(
        0,
        [bob.address, charlie.address, darwin.address],
        [1000, 1000, 1000]
      );
      const receipt1 = await tokenVesting.grant(
        1,
        [bob.address, charlie.address, darwin.address],
        [2000, 2000, 2000]
      );
      const receipt2 = await tokenVesting.grant(
        2,
        [bob.address, charlie.address, darwin.address],
        [3000, 3000, 3000]
      );

      // check events
      expect(receipt0)
        .to.emit(tokenVesting, "Grant")
        .withArgs(0, bob.address, 1000);
      expect(receipt0)
        .to.emit(tokenVesting, "Grant")
        .withArgs(0, charlie.address, 1000);
      expect(receipt0)
        .to.emit(tokenVesting, "Grant")
        .withArgs(0, darwin.address, 1000);

      var balance = await xToken.balanceOf(tokenVesting.address);
      expect(balance).to.equal(18000);

      const bobVestings = await tokenVesting.allSoloVestings(bob.address);
      const charlieVestings = await tokenVesting.allSoloVestings(
        charlie.address
      );
      const darwinVestings = await tokenVesting.allSoloVestings(darwin.address);
      expect(bobVestings[0].vestingID).to.equal(0);
      expect(bobVestings[0].beneficiary).to.equal(bob.address);
      expect(bobVestings[0].grantAmount).to.equal(1000);
      expect(bobVestings[0].withdrawAmount).to.equal(0);
      expect(bobVestings[1].vestingID).to.equal(1);
      expect(bobVestings[1].beneficiary).to.equal(bob.address);
      expect(bobVestings[1].grantAmount).to.equal(2000);
      expect(bobVestings[1].withdrawAmount).to.equal(0);
      expect(bobVestings[2].vestingID).to.equal(2);
      expect(bobVestings[2].beneficiary).to.equal(bob.address);
      expect(bobVestings[2].grantAmount).to.equal(3000);
      expect(bobVestings[2].withdrawAmount).to.equal(0);

      expect(charlieVestings[0].vestingID).to.equal(0);
      expect(charlieVestings[0].beneficiary).to.equal(charlie.address);
      expect(charlieVestings[0].grantAmount).to.equal(1000);
      expect(charlieVestings[0].withdrawAmount).to.equal(0);
      expect(charlieVestings[1].vestingID).to.equal(1);
      expect(charlieVestings[1].beneficiary).to.equal(charlie.address);
      expect(charlieVestings[1].grantAmount).to.equal(2000);
      expect(charlieVestings[1].withdrawAmount).to.equal(0);
      expect(charlieVestings[2].vestingID).to.equal(2);
      expect(charlieVestings[2].beneficiary).to.equal(charlie.address);
      expect(charlieVestings[2].grantAmount).to.equal(3000);
      expect(charlieVestings[2].withdrawAmount).to.equal(0);

      expect(darwinVestings[0].vestingID).to.equal(0);
      expect(darwinVestings[0].beneficiary).to.equal(darwin.address);
      expect(darwinVestings[0].grantAmount).to.equal(1000);
      expect(darwinVestings[0].withdrawAmount).to.equal(0);
      expect(darwinVestings[1].vestingID).to.equal(1);
      expect(darwinVestings[1].beneficiary).to.equal(darwin.address);
      expect(darwinVestings[1].grantAmount).to.equal(2000);
      expect(darwinVestings[1].withdrawAmount).to.equal(0);
      expect(darwinVestings[2].vestingID).to.equal(2);
      expect(darwinVestings[2].beneficiary).to.equal(darwin.address);
      expect(darwinVestings[2].grantAmount).to.equal(3000);
      expect(darwinVestings[2].withdrawAmount).to.equal(0);

      // grant to vesting 0 again
      await tokenVesting.grant(
        0,
        [bob.address, charlie.address, darwin.address],
        [1000, 1000, 1000]
      );
      balance = await xToken.balanceOf(tokenVesting.address);
      expect(balance).to.equal(21000);

      vestingSched = await tokenVesting.vestingSched(0);
      expect(vestingSched.grantAmount).to.equal(6000);
      expect(vestingSched.withdrawAmount).to.equal(0);
    });

    it("grant new vesting revert: vesting does not exist", async () => {
      await expectRevert(
        tokenVesting.grant(
          3,
          [bob.address, charlie.address, darwin.address],
          [4000, 4000, 4000]
        ),
        "Vesting does not exist"
      );
    });

    it("grant revert", async () => {
      await expectRevert(
        tokenVesting.grant(
          10,
          [bob.address, charlie.address, darwin.address],
          [1000, 1000, 1000]
        ),
        "Vesting does not exist"
      );

      await xToken.connect(alice).approve(tokenVesting.address, BN100);

      await expectRevert(
        tokenVesting.grant(
          0,
          [bob.address, charlie.address, darwin.address],
          [1000, 1000, 1000]
        ),
        "ERC20: insufficient allowance"
      );
    });

    it("withdraw normally", async () => {
      await tokenVesting.grant(
        0,
        [bob.address, charlie.address, darwin.address],
        [1000, 1000, 1000]
      );
      await tokenVesting.grant(
        1,
        [bob.address, charlie.address, darwin.address],
        [2000, 2000, 2000]
      );
      balance = await xToken.balanceOf(tokenVesting.address);
      expect(balance).to.equal(9000);
      balance = await xToken.balanceOf(bob.address);
      expect(balance).to.equal(0);

      // withdraw bob from vesting 0
      const receipt0 = await tokenVesting.connect(bob).withdraw(0, 200);
      balance = await xToken.balanceOf(bob.address);
      expect(balance).to.equal(200);
      expect(receipt0)
        .to.emit(tokenVesting, "Withdraw")
        .withArgs(0, bob.address, bob.address, 200);
      const receipt1 = await tokenVesting
        .connect(bob)
        .withdrawTo(0, 200, charlie.address);
      expect(receipt1)
        .to.emit(tokenVesting, "Withdraw")
        .withArgs(0, bob.address, charlie.address, 200);

      var vestingSched = await tokenVesting.vestingSched(0);
      expect(vestingSched.grantAmount).to.equal(3000);
      expect(vestingSched.withdrawAmount).to.equal(400);

      var soloVesting = await tokenVesting.soloVesting(0, bob.address);
      expect(soloVesting.grantAmount).to.equal(1000);
      expect(soloVesting.withdrawAmount).to.equal(400);

      // withdraw charlie from vesting 0
      await tokenVesting.connect(charlie).withdraw(0, 300);
      balance = await xToken.balanceOf(charlie.address);
      expect(balance).to.equal(500);

      vestingSched = await tokenVesting.vestingSched(0);
      expect(vestingSched.grantAmount).to.equal(3000);
      expect(vestingSched.withdrawAmount).to.equal(700);

      soloVesting = await tokenVesting.soloVesting(0, charlie.address);
      expect(soloVesting.grantAmount).to.equal(1000);
      expect(soloVesting.withdrawAmount).to.equal(300);

      // withdraw darwin from vesting 1
      await tokenVesting.connect(darwin).withdraw(1, 400);
      balance = await xToken.balanceOf(darwin.address);
      expect(balance).to.equal(400);

      vestingSched = await tokenVesting.vestingSched(1);
      expect(vestingSched.grantAmount).to.equal(6000);
      expect(vestingSched.withdrawAmount).to.equal(400);

      soloVesting = await tokenVesting.soloVesting(1, darwin.address);
      expect(soloVesting.grantAmount).to.equal(2000);
      expect(soloVesting.withdrawAmount).to.equal(400);

      // contract balance
      balance = await xToken.balanceOf(tokenVesting.address);
      expect(balance).to.equal(7900);
    });

    it("withdraw reverts", async () => {
      await tokenVesting.grant(
        0,
        [bob.address, charlie.address, darwin.address],
        [1000, 1000, 1000]
      );
      await tokenVesting.grant(
        1,
        [bob.address, charlie.address, darwin.address],
        [2000, 2000, 2000]
      );

      // withdraw from non granted
      await expectRevert(
        tokenVesting.connect(alice).withdraw(0, 1),
        "Not sufficient fund for withdrawal"
      );

      // withdraw too much
      await expectRevert(
        tokenVesting.connect(bob).withdraw(0, 1000000),
        "Not sufficient fund for withdrawal"
      );

      // withdraw from non-existed vesting id
      await expectRevert(
        tokenVesting.connect(bob).withdraw(10, 1),
        "Vesting does not exist"
      );
    });

    it("transfer normally", async () => {
      await tokenVesting.grant(
        0,
        [bob.address, charlie.address, darwin.address],
        [1000, 1000, 1000]
      );
      await tokenVesting.grant(
        1,
        [bob.address, charlie.address, darwin.address],
        [2000, 2000, 2000]
      );

      // transfer from bob to charlie in vesting 0
      const receipt = await tokenVesting
        .connect(bob)
        .transfer(0, darwin.address, 200);
      expect(receipt)
        .emit(tokenVesting, "Transfer")
        .withArgs(0, bob.address, darwin.address, 200);

      var vestingSched = await tokenVesting.vestingSched(0);
      expect(vestingSched.grantAmount).to.equal(3000);
      expect(vestingSched.withdrawAmount).to.equal(0);

      var soloVesting = await tokenVesting.soloVesting(0, bob.address);
      expect(soloVesting.grantAmount).to.equal(800);
      expect(soloVesting.withdrawAmount).to.equal(0);

      soloVesting = await tokenVesting.soloVesting(0, darwin.address);
      expect(soloVesting.grantAmount).to.equal(1200);
      expect(soloVesting.withdrawAmount).to.equal(0);

      // transfer from bob to charlie in vesting 1
      await tokenVesting.connect(bob).transfer(1, charlie.address, 500);

      var vestingSched = await tokenVesting.vestingSched(1);
      expect(vestingSched.grantAmount).to.equal(6000);
      expect(vestingSched.withdrawAmount).to.equal(0);

      var soloVesting = await tokenVesting.soloVesting(1, bob.address);
      expect(soloVesting.grantAmount).to.equal(1500);
      expect(soloVesting.withdrawAmount).to.equal(0);

      soloVesting = await tokenVesting.soloVesting(1, charlie.address);
      expect(soloVesting.grantAmount).to.equal(2500);
      expect(soloVesting.withdrawAmount).to.equal(0);

      // check balance
      var balance = await xToken.balanceOf(tokenVesting.address);
      expect(balance).to.equal(9000);

      balance = await xToken.balanceOf(bob.address);
      expect(balance).to.equal(0);
      balance = await xToken.balanceOf(charlie.address);
      expect(balance).to.equal(0);
      balance = await xToken.balanceOf(darwin.address);
      expect(balance).to.equal(0);
    });

    it("transfer reverts", async () => {
      await tokenVesting.grant(
        0,
        [bob.address, charlie.address, darwin.address],
        [1000, 1000, 1000]
      );
      await tokenVesting.grant(
        1,
        [bob.address, charlie.address, darwin.address],
        [2000, 2000, 2000]
      );

      // transfer too much
      await expectRevert(
        tokenVesting.connect(bob).transfer(0, charlie.address, 5000),
        "Not sufficient fund for transfer"
      );

      // transfer 0
      await expectRevert(
        tokenVesting.connect(bob).transfer(0, charlie.address, 0),
        "Transfer amount should be non-zero"
      );

      // transfer from non-exist vesting id
      await expectRevert(
        tokenVesting.connect(bob).transfer(10, charlie.address, 1),
        "Vesting does not exist"
      );
    });

    it("update funding normally", async () => {
      var funding = await tokenVesting.funding();
      expect(funding).to.equal(alice.address);
      await tokenVesting.updateFunding(darwin.address);
      funding = await tokenVesting.funding();
      expect(funding).to.equal(darwin.address);

      // revert
      await expectRevert(
        tokenVesting.connect(bob).updateFunding(darwin.address),
        "Caller is not a admin"
      );
    });

    it("only granter can call grant", async () => {
      await expectRevert(
        tokenVesting
          .connect(bob)
          .grant(
            0,
            [bob.address, charlie.address, darwin.address],
            [1000, 1000, 1000]
          ),
        "Caller is not a granter"
      );

      await expectRevert(
        tokenVesting.connect(alice).grantGranter(bob.address),
        "Caller is not a admin"
      );

      await tokenVesting.grantGranter(bob.address);
      await tokenVesting
        .connect(bob)
        .grant(
          0,
          [bob.address, charlie.address, darwin.address],
          [1000, 1000, 1000]
        );
    });
  });
});
