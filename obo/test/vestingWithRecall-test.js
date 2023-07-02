const { ethers, expect } = require("hardhat");
const { expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const { BigNumber } = require("ethers");
const { current } = require("@openzeppelin/test-helpers/src/balance");

const BN0 = new BigNumber.from("0");
const BN18 = new BigNumber.from("18");
const BN100 = new BigNumber.from("100");
const BN1B = new BigNumber.from("1000000000");
const BN2B = new BigNumber.from("2000000000");
const BNMAX = new BigNumber.from("1000000000000000000000000000");

contract("TokenVestingWithRecall", function () {
  let xToken;
  let tokenVesting;
  let currentTime;
  let alice;
  let bob;
  let charlie;
  let darwin;

  beforeEach(async () => {
    [alice, bob, charlie, darwin] = await ethers.getSigners();
    const XToken = await ethers.getContractFactory("XToken");
    xToken = await XToken.deploy("Test coin", "TCOIN", BNMAX);
    await xToken.mint(alice.address, BN1B);

    const TokenVesting = await ethers.getContractFactory("TokenVestingWithRecall");
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
      await expect(tokenVesting.newVestingSched("vesting 12 month", currentTime))
        .to.emit(tokenVesting, "Vesting").withArgs(3, "vesting 12 month", currentTime);
      const id = await tokenVesting.vestingSchedID();
      expect(id).to.be.equal(4);

      const vestingScheds = await tokenVesting.allVestingScheds();
      expect(vestingScheds[0].id).to.equal(0);
      expect(vestingScheds[0].name).to.equal("vesting 1 month");
      expect(vestingScheds[0].vestingTime).to.be.within(
        currentTime - 1,
        currentTime + 1
      );
      expect(vestingScheds[0].grantAmount).to.equal(0);
      expect(vestingScheds[0].withdrawAmount).to.equal(0);
      expect(vestingScheds[1].id).to.equal(1);
      expect(vestingScheds[1].name).to.equal("vesting 3 month");
      expect(vestingScheds[1].vestingTime).to.be.within(
        currentTime - 1,
        currentTime + 1
      );
      expect(vestingScheds[1].grantAmount).to.equal(0);
      expect(vestingScheds[1].withdrawAmount).to.equal(0);
      expect(vestingScheds[2].id).to.equal(2);
      expect(vestingScheds[2].name).to.equal("vesting 6 month");
      expect(vestingScheds[2].vestingTime).to.be.within(
        currentTime - 1,
        currentTime + 1
      );
      expect(vestingScheds[2].grantAmount).to.equal(0);
      expect(vestingScheds[2].withdrawAmount).to.equal(0);
      expect(vestingScheds[3].id).to.equal(3);
      expect(vestingScheds[3].name).to.equal("vesting 12 month");
      expect(vestingScheds[3].vestingTime).to.equal(currentTime);
      expect(vestingScheds[3].grantAmount).to.equal(0);
      expect(vestingScheds[3].withdrawAmount).to.equal(0);
    });

    it("grant new vesting", async () => {
      await expect(tokenVesting.grant(
        0,
        [bob.address, charlie.address, darwin.address],
        [1000, 1000, 1000]
      )).to.emit(tokenVesting, "Grant").withArgs(0, bob.address, 1000);

      await expect(tokenVesting.grant(
        1,
        [bob.address, charlie.address, darwin.address],
        [2000, 2000, 2000]
      )).to.emit(tokenVesting, "Grant").withArgs(1, charlie.address, 2000);

      await expect(tokenVesting.grant(
        2,
        [bob.address, charlie.address, darwin.address],
        [3000, 3000, 3000]
      )).to.emit(tokenVesting, "Grant").withArgs(2, darwin.address, 3000);

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

    it("triple grant should have triple amounts", async () => {
      await tokenVesting.grant(
        0,
        [bob.address, charlie.address, darwin.address],
        [1000, 1000, 1000]
      );
      await tokenVesting.grant(
        0,
        [bob.address, charlie.address, darwin.address],
        [1000, 1000, 1000]
      );
      await tokenVesting.grant(
        0,
        [bob.address, charlie.address, darwin.address],
        [1000, 1000, 1000]
      );
      const bobVestings = await tokenVesting.allSoloVestings(bob.address);
      expect(bobVestings[0].vestingID).to.equal(0);
      expect(bobVestings[0].beneficiary).to.equal(bob.address);
      expect(bobVestings[0].grantAmount).to.equal(3000);
      expect(bobVestings[0].withdrawAmount).to.equal(0);
      const charlieVestings = await tokenVesting.allSoloVestings(charlie.address);
      expect(charlieVestings[0].vestingID).to.equal(0);
      expect(charlieVestings[0].beneficiary).to.equal(charlie.address);
      expect(charlieVestings[0].grantAmount).to.equal(3000);
      expect(charlieVestings[0].withdrawAmount).to.equal(0);
      const darwinVestings = await tokenVesting.allSoloVestings(darwin.address);
      expect(darwinVestings[0].vestingID).to.equal(0);
      expect(darwinVestings[0].beneficiary).to.equal(darwin.address);
      expect(darwinVestings[0].grantAmount).to.equal(3000);
      expect(darwinVestings[0].withdrawAmount).to.equal(0);

      var vestingSched = await tokenVesting.vestingSched(0);
      expect(vestingSched.grantAmount).to.equal(9000);
      expect(vestingSched.withdrawAmount).to.equal(0);

      // withdraw twice from bob
      await tokenVesting.connect(bob).withdraw(0, 200);
      await tokenVesting.connect(bob).withdraw(0, 200);
      // withdraw twice from charlie
      await tokenVesting.connect(charlie).withdraw(0, 200);
      await tokenVesting.connect(charlie).withdraw(0, 200);
      // withdraw twice from darwin
      await tokenVesting.connect(darwin).withdraw(0, 200);
      await tokenVesting.connect(darwin).withdraw(0, 200);

      // check total sched grant and withdraw
      vestingSched = await tokenVesting.vestingSched(0);
      expect(vestingSched.grantAmount).to.equal(9000);
      expect(vestingSched.withdrawAmount).to.equal(1200);

      // drain bob
      await tokenVesting.connect(bob).withdraw(0, 2600);
      // bob withdraw will revert
      await expectRevert(
        tokenVesting.connect(bob).withdraw(0, 1),
        "Not sufficient fund for withdrawal"
      );
    });

    it("recall vesting", async () => {
      await tokenVesting.grant(
        0,
        [bob.address, charlie.address, darwin.address],
        [1000, 1000, 1000]
      );
      await tokenVesting.grant(
        0,
        [bob.address, charlie.address, darwin.address],
        [1000, 1000, 1000]
      );
      await tokenVesting.grant(
        1,
        [bob.address, charlie.address, darwin.address],
        [2000, 3000, 2000]
      );
      await tokenVesting.grant(
        1,
        [bob.address, charlie.address, darwin.address],
        [2000, 3000, 2000]
      );

      // check xtoken balance of the contract
      var balance = await xToken.balanceOf(tokenVesting.address);
      expect(balance).to.equal(20000);
      // check xtoken balance of bob
      balance = await xToken.balanceOf(bob.address);
      expect(balance).to.equal(0);

      // check bob vestings
      var bobVestings = await tokenVesting.allSoloVestings(bob.address);
      expect(bobVestings[0].vestingID).to.equal(0);
      expect(bobVestings[0].beneficiary).to.equal(bob.address);
      expect(bobVestings[0].grantAmount).to.equal(2000);
      expect(bobVestings[0].withdrawAmount).to.equal(0);
      expect(bobVestings[1].vestingID).to.equal(1);
      expect(bobVestings[1].beneficiary).to.equal(bob.address);
      expect(bobVestings[1].grantAmount).to.equal(4000);
      expect(bobVestings[1].withdrawAmount).to.equal(0);

      await expect(tokenVesting.recallVesting(0, bob.address, bob.address))
        .to.emit(tokenVesting, "Recall").withArgs(0, bob.address, bob.address, 2000);

      // check xtoken balance of the contract
      balance = await xToken.balanceOf(tokenVesting.address);
      expect(balance).to.equal(18000);
      // check xtoken balance of bob
      balance = await xToken.balanceOf(bob.address);
      expect(balance).to.equal(2000);

      // check bob vestings
      var bobVestings = await tokenVesting.allSoloVestings(bob.address);
      expect(bobVestings[0].vestingID).to.equal(0);
      expect(bobVestings[0].beneficiary).to.equal(bob.address);
      expect(bobVestings[0].grantAmount).to.equal(2000);
      expect(bobVestings[0].withdrawAmount).to.equal(2000);
      expect(bobVestings[1].vestingID).to.equal(1);
      expect(bobVestings[1].beneficiary).to.equal(bob.address);
      expect(bobVestings[1].grantAmount).to.equal(4000);
      expect(bobVestings[1].withdrawAmount).to.equal(0);


      // check total sched grant and withdraw
      var vestingSched = await tokenVesting.vestingSched(0);
      expect(vestingSched.grantAmount).to.equal(6000);
      expect(vestingSched.withdrawAmount).to.equal(2000);
      vestingSched1 = await tokenVesting.vestingSched(1);
      expect(vestingSched1.grantAmount).to.equal(14000);
      expect(vestingSched1.withdrawAmount).to.equal(0);

      // recall vesting sched 0 from bob to alice
      await expectRevert(
        tokenVesting.recallVesting(0, bob.address, bob.address),
        "Recall amount should be non-zero"
      );

      // alice token balance before
      balanceBefore = await xToken.balanceOf(alice.address);
      // 1000000000 - 20000 = 999980000 as alice fund the vesting contract
      expect(balanceBefore).to.equal(999980000);

      // bob withdraw 1500 from sched 1
      await tokenVesting.connect(bob).withdraw(1, 1500);

      // recall revert because of privilege
      await expectRevert(
        tokenVesting.connect(darwin).recallVesting(1, bob.address, bob.address),
        "Caller is not a admin"
      );
      // recall the rest of vesting sched 1 from bob to alice
      await expect(tokenVesting.recallVesting(1, bob.address, alice.address))
        .to.emit(tokenVesting, "Recall").withArgs(1, bob.address, alice.address, 2500);

      // check xtoken balance of the contract
      balance = await xToken.balanceOf(tokenVesting.address);
      // 20000 - 2000 - 1500 - 2500 = 14000
      expect(balance).to.equal(14000);
      // check xtoken balance of alice
      balanceAfter = await xToken.balanceOf(alice.address);
      expect(balanceAfter).to.equal(999982500);
      // check solo vestings of bob
      bobVestings = await tokenVesting.allSoloVestings(bob.address);
      expect(bobVestings[0].vestingID).to.equal(0);
      expect(bobVestings[0].beneficiary).to.equal(bob.address);
      expect(bobVestings[0].grantAmount).to.equal(2000);
      expect(bobVestings[0].withdrawAmount).to.equal(2000);
      expect(bobVestings[1].vestingID).to.equal(1);
      expect(bobVestings[1].beneficiary).to.equal(bob.address);
      expect(bobVestings[1].grantAmount).to.equal(4000);
      expect(bobVestings[1].withdrawAmount).to.equal(4000);
    });

    it("multiple scheds and multiple users", async () => {
      await tokenVesting.grant(
        0,
        [bob.address, charlie.address, darwin.address],
        [1000, 1000, 1000]
      );
      await tokenVesting.grant(
        0,
        [bob.address, charlie.address, darwin.address],
        [1000, 1000, 1000]
      );
      await tokenVesting.grant(
        1,
        [bob.address, charlie.address, darwin.address],
        [2000, 3000, 2000]
      );
      await tokenVesting.grant(
        1,
        [bob.address, charlie.address, darwin.address],
        [2000, 3000, 2000]
      );

      // check allSoloVestingsForSched()
      const soloVestingsLength = await tokenVesting.soloVestingsLength(0)
      expect(soloVestingsLength).to.equal(3);
      const allSoloVestingsForSched = await tokenVesting.allSoloVestingsForSched(0)
      expect(allSoloVestingsForSched[0].vestingID).to.equal(0);
      expect(allSoloVestingsForSched[0].beneficiary).to.equal(bob.address);
      expect(allSoloVestingsForSched[0].grantAmount).to.equal(2000);
      expect(allSoloVestingsForSched[0].withdrawAmount).to.equal(0);
      expect(allSoloVestingsForSched[1].vestingID).to.equal(0);
      expect(allSoloVestingsForSched[1].beneficiary).to.equal(charlie.address);
      expect(allSoloVestingsForSched[1].grantAmount).to.equal(2000);
      expect(allSoloVestingsForSched[1].withdrawAmount).to.equal(0);
      expect(allSoloVestingsForSched[2].vestingID).to.equal(0);
      expect(allSoloVestingsForSched[2].beneficiary).to.equal(darwin.address);
      expect(allSoloVestingsForSched[2].grantAmount).to.equal(2000);
      expect(allSoloVestingsForSched[2].withdrawAmount).to.equal(0);

      const soloVestingsLength1 = await tokenVesting.soloVestingsLength(1)
      expect(soloVestingsLength1).to.equal(3);
      const allSoloVestingsForSched1 = await tokenVesting.allSoloVestingsForSched(1)
      expect(allSoloVestingsForSched1[0].vestingID).to.equal(1);
      expect(allSoloVestingsForSched1[0].beneficiary).to.equal(bob.address);
      expect(allSoloVestingsForSched1[0].grantAmount).to.equal(4000);
      expect(allSoloVestingsForSched1[0].withdrawAmount).to.equal(0);
      expect(allSoloVestingsForSched1[1].vestingID).to.equal(1);
      expect(allSoloVestingsForSched1[1].beneficiary).to.equal(charlie.address);
      expect(allSoloVestingsForSched1[1].grantAmount).to.equal(6000);
      expect(allSoloVestingsForSched1[1].withdrawAmount).to.equal(0);
      expect(allSoloVestingsForSched1[2].vestingID).to.equal(1);
      expect(allSoloVestingsForSched1[2].beneficiary).to.equal(darwin.address);
      expect(allSoloVestingsForSched1[2].grantAmount).to.equal(4000);
      expect(allSoloVestingsForSched1[2].withdrawAmount).to.equal(0);


      const bobVestings = await tokenVesting.allSoloVestings(bob.address);
      expect(bobVestings[0].vestingID).to.equal(0);
      expect(bobVestings[0].beneficiary).to.equal(bob.address);
      expect(bobVestings[0].grantAmount).to.equal(2000);
      expect(bobVestings[0].withdrawAmount).to.equal(0);
      expect(bobVestings[1].vestingID).to.equal(1);
      expect(bobVestings[1].beneficiary).to.equal(bob.address);
      expect(bobVestings[1].grantAmount).to.equal(4000);
      expect(bobVestings[1].withdrawAmount).to.equal(0);

      const charlieVestings = await tokenVesting.allSoloVestings(charlie.address);
      expect(charlieVestings[0].vestingID).to.equal(0);
      expect(charlieVestings[0].beneficiary).to.equal(charlie.address);
      expect(charlieVestings[0].grantAmount).to.equal(2000);
      expect(charlieVestings[0].withdrawAmount).to.equal(0);
      expect(charlieVestings[1].vestingID).to.equal(1);
      expect(charlieVestings[1].beneficiary).to.equal(charlie.address);
      expect(charlieVestings[1].grantAmount).to.equal(6000);
      expect(charlieVestings[1].withdrawAmount).to.equal(0);

      // bob withdraw twice from sched 0 
      await tokenVesting.connect(bob).withdraw(0, 200);
      await tokenVesting.connect(bob).withdraw(0, 200);
      // charlie withdraw twice from sched 0
      await tokenVesting.connect(charlie).withdraw(0, 200);
      await tokenVesting.connect(charlie).withdraw(0, 200);

      var vestingSched = await tokenVesting.vestingSched(0);
      expect(vestingSched.grantAmount).to.equal(6000);
      expect(vestingSched.withdrawAmount).to.equal(800);

      // bob withdraw twice from sched 1
      await tokenVesting.connect(bob).withdraw(1, 500);
      await tokenVesting.connect(bob).withdraw(1, 500);
      // charlie withdraw twice from sched 1
      await tokenVesting.connect(charlie).withdraw(1, 1000);
      await tokenVesting.connect(charlie).withdraw(1, 1000);

      vestingSched = await tokenVesting.vestingSched(1);
      expect(vestingSched.grantAmount).to.equal(14000);
      expect(vestingSched.withdrawAmount).to.equal(3000);

      // check bob vesting
      const bobVestings2 = await tokenVesting.allSoloVestings(bob.address);
      expect(bobVestings2[0].vestingID).to.equal(0);
      expect(bobVestings2[0].beneficiary).to.equal(bob.address);
      expect(bobVestings2[0].grantAmount).to.equal(2000);
      expect(bobVestings2[0].withdrawAmount).to.equal(400);
      expect(bobVestings2[1].vestingID).to.equal(1);
      expect(bobVestings2[1].beneficiary).to.equal(bob.address);
      expect(bobVestings2[1].grantAmount).to.equal(4000);
      expect(bobVestings2[1].withdrawAmount).to.equal(1000);

      // check charlie vesting
      const charlieVestings2 = await tokenVesting.allSoloVestings(charlie.address);
      expect(charlieVestings2[0].vestingID).to.equal(0);
      expect(charlieVestings2[0].beneficiary).to.equal(charlie.address);
      expect(charlieVestings2[0].grantAmount).to.equal(2000);
      expect(charlieVestings2[0].withdrawAmount).to.equal(400);
      expect(charlieVestings2[1].vestingID).to.equal(1);
      expect(charlieVestings2[1].beneficiary).to.equal(charlie.address);
      expect(charlieVestings2[1].grantAmount).to.equal(6000);
      expect(charlieVestings2[1].withdrawAmount).to.equal(2000);

      // check xtoken balance
      expect(await xToken.balanceOf(bob.address)).to.equal(1400);
      expect(await xToken.balanceOf(charlie.address)).to.equal(2400);

    })

    it("update vesting time", async () => {
      currentTime = Math.floor(new Date() / 1000);
      await tokenVesting.updateVestingSchedTime(0, currentTime + 1000);
      await tokenVesting.grant(0, [bob.address], [1000]);

      // check bob's grant
      const bobVestings = await tokenVesting.allSoloVestings(bob.address);
      expect(bobVestings[0].vestingID).to.equal(0);
      expect(bobVestings[0].beneficiary).to.equal(bob.address);
      expect(bobVestings[0].grantAmount).to.equal(1000);
      expect(bobVestings[0].withdrawAmount).to.equal(0);

      // bob can not withdraw
      await expectRevert(
        tokenVesting.connect(bob).withdraw(0, 1000),
        "Can not withdraw before vesting starts"
      );

      // update vesting sched time
      await tokenVesting.updateVestingSchedTime(0, currentTime - 1000);
      await tokenVesting.connect(bob).withdraw(0, 1000);

      // check bob's grant again
      const bobVestings2 = await tokenVesting.allSoloVestings(bob.address);
      expect(bobVestings2[0].vestingID).to.equal(0);
      expect(bobVestings2[0].beneficiary).to.equal(bob.address);
      expect(bobVestings2[0].grantAmount).to.equal(1000);
      expect(bobVestings2[0].withdrawAmount).to.equal(1000);
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

      // not enough allowance: 100 < 1000
      await xToken.connect(alice).approve(tokenVesting.address, BN100);
      await expectRevert(
        tokenVesting.grant(
          0,
          [bob.address, charlie.address, darwin.address],
          [1000, 1000, 1000]
        ),
        "ERC20: insufficient allowance"
      );

      // alice balance 1B < 2B needed
      await xToken.connect(alice).approve(tokenVesting.address, BN2B);
      await expectRevert(
        tokenVesting.grant(
          0,
          [bob.address],
          [BN2B]
        ),
        "ERC20: transfer amount exceeds balance"
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
      await expect(tokenVesting.connect(bob).withdraw(0, 200))
        .to.emit(tokenVesting, "Withdraw").withArgs(0, bob.address, bob.address, 200);
      balance = await xToken.balanceOf(bob.address);
      expect(balance).to.equal(200);
      await expect(tokenVesting.connect(bob).withdrawTo(0, 200, charlie.address))
        .to.emit(tokenVesting, "Withdraw").withArgs(0, bob.address, charlie.address, 200);

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
      await expect(tokenVesting.connect(bob).transfer(darwin.address, 0, 200))
        .emit(tokenVesting, "Transfer").withArgs(0, bob.address, darwin.address, 200);

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
      await tokenVesting.connect(bob).transfer(charlie.address, 1, 500);

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
      await expectRevert(tokenVesting.connect(bob).transfer(charlie.address, 0, 5000),
        "Not sufficient fund for transfer"
      );

      // transfer if net amount is not enough for bob
      await tokenVesting.connect(bob).withdraw(0, 900);
      await expectRevert(tokenVesting.connect(bob).transfer(charlie.address, 0, 200),
        "Not sufficient fund for transfer"
      );

      // transfer 0
      await expectRevert(
        tokenVesting.connect(bob).transfer(charlie.address, 0, 0),
        "Transfer amount should be non-zero"
      );

      // transfer from non-exist vesting id
      await expectRevert(
        tokenVesting.connect(bob).transfer(charlie.address, 10, 1),
        "Vesting does not exist"
      );
    });

    it("transferFrom normally and reverts", async () => {
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

      // approve vesting 0
      await tokenVesting.connect(bob).approve(alice.address, 0, 1000);
      await tokenVesting.connect(charlie).approve(alice.address, 0, 1000);
      await tokenVesting.connect(darwin).approve(alice.address, 0, 1000);

      // approve vesting 1
      await tokenVesting.connect(bob).approve(alice.address, 1, 2000);
      await tokenVesting.connect(charlie).approve(alice.address, 1, 2000);
      await tokenVesting.connect(darwin).approve(alice.address, 1, 2000);

      // check alice allowance vesting 0
      var allowance = await tokenVesting.allowance(bob.address, alice.address, 0);
      expect(allowance).to.equal(1000);
      allowance = await tokenVesting.allowance(charlie.address, alice.address, 0);
      expect(allowance).to.equal(1000);
      allowance = await tokenVesting.allowance(darwin.address, alice.address, 0);
      expect(allowance).to.equal(1000);

      // check alice allowance vesting 1
      allowance = await tokenVesting.allowance(bob.address, alice.address, 1);
      expect(allowance).to.equal(2000);
      allowance = await tokenVesting.allowance(charlie.address, alice.address, 1);
      expect(allowance).to.equal(2000);
      allowance = await tokenVesting.allowance(darwin.address, alice.address, 1);
      expect(allowance).to.equal(2000);

      // alice soloVesting
      var soloVesting = await tokenVesting.soloVesting(0, alice.address);
      expect(soloVesting.grantAmount).to.equal(0);
      expect(soloVesting.withdrawAmount).to.equal(0);
      soloVesting = await tokenVesting.soloVesting(1, alice.address);
      expect(soloVesting.grantAmount).to.equal(0);
      expect(soloVesting.withdrawAmount).to.equal(0);

      // transfer from bob to alice in vesting 0
      await expect(tokenVesting.connect(alice).transferFrom(bob.address, alice.address, 0, 200))
        .to.emit(tokenVesting, "Transfer").withArgs(0, bob.address, alice.address, 200);
      // transfer from bob to darwin by alice in vesting 0
      await expect(tokenVesting.connect(alice).transferFrom(bob.address, darwin.address, 0, 200))
        .to.emit(tokenVesting, "Transfer").withArgs(0, bob.address, darwin.address, 200);

      var vestingSched = await tokenVesting.vestingSched(0);
      expect(vestingSched.grantAmount).to.equal(3000);
      expect(vestingSched.withdrawAmount).to.equal(0);

      soloVesting = await tokenVesting.soloVesting(0, bob.address);
      expect(soloVesting.grantAmount).to.equal(600);
      expect(soloVesting.withdrawAmount).to.equal(0);

      soloVesting = await tokenVesting.soloVesting(0, alice.address);
      expect(soloVesting.grantAmount).to.equal(200);
      expect(soloVesting.withdrawAmount).to.equal(0);

      soloVesting = await tokenVesting.soloVesting(0, darwin.address);
      expect(soloVesting.grantAmount).to.equal(1200);
      expect(soloVesting.withdrawAmount).to.equal(0);

      // transfer from bob to alice will revert if amount > approved
      allowance = await tokenVesting.allowance(bob.address, alice.address, 0);
      expect(allowance).to.equal(600);
      await expectRevert(
        tokenVesting.connect(alice).transferFrom(bob.address, alice.address, 0, 1000),
        "Insufficient allowance")

      // transfer from bob to chalie in so that balance < allowance for alice
      await tokenVesting.connect(bob).transfer(charlie.address, 0, 200);
      // bob decrease to 400
      soloVesting = await tokenVesting.soloVesting(0, bob.address);
      expect(soloVesting.grantAmount).to.equal(400);
      expect(soloVesting.withdrawAmount).to.equal(0);
      // charlie increase to 1200
      soloVesting = await tokenVesting.soloVesting(0, charlie.address);
      expect(soloVesting.grantAmount).to.equal(1200);
      expect(soloVesting.withdrawAmount).to.equal(0);

      // transfer from bob to alice in vesting 0
      allowance = await tokenVesting.allowance(bob.address, alice.address, 0);
      expect(allowance).to.equal(600);
      // alice allowance 600 but bob only has 400
      await expectRevert(
        tokenVesting.connect(alice).transferFrom(bob.address, alice.address, 0, 600),
        "Not sufficient fund for transfer"
      );
      // transfer 600 from bob to alices
      await tokenVesting.connect(alice).transferFrom(bob.address, alice.address, 0, 400);

      // check bob and alice balance
      // bob: 1000-200-200-200-400 = 0
      var soloVesting = await tokenVesting.soloVesting(0, bob.address);
      expect(soloVesting.grantAmount).to.equal(0);
      expect(soloVesting.withdrawAmount).to.equal(0);
      // alice: 200+400
      soloVesting = await tokenVesting.soloVesting(0, alice.address);
      expect(soloVesting.grantAmount).to.equal(600);
      expect(soloVesting.withdrawAmount).to.equal(0);

      // no approve, no tranferFrom
      await expectRevert(
        tokenVesting.connect(charlie).transferFrom(bob.address, alice.address, 0, 100),
        "Insufficient allowance"
      )
    });

    it("multiple grant/transfer/withdraw operations", async () => {
      await tokenVesting.grant(
        0,
        [bob.address],
        [1000]
      );
      balance = await xToken.balanceOf(tokenVesting.address);
      expect(balance).to.equal(1000);

      // check total vesting
      var vestingSched = await tokenVesting.vestingSched(0);
      expect(vestingSched.grantAmount).to.equal(1000);
      expect(vestingSched.withdrawAmount).to.equal(0);

      // withdraw 200 and check balance
      await tokenVesting.connect(bob).withdraw(0, 200);
      soloVesting = await tokenVesting.soloVesting(0, bob.address);
      expect(soloVesting.grantAmount).to.equal(1000);
      expect(soloVesting.withdrawAmount).to.equal(200);

      balance = await xToken.balanceOf(tokenVesting.address);
      expect(balance).to.equal(800);
      balance = await xToken.balanceOf(bob.address);
      expect(balance).to.equal(200);

      // withdraw 200 and check balance
      await tokenVesting.connect(bob).withdraw(0, 200);
      soloVesting = await tokenVesting.soloVesting(0, bob.address);
      expect(soloVesting.grantAmount).to.equal(1000);
      expect(soloVesting.withdrawAmount).to.equal(400);

      balance = await xToken.balanceOf(tokenVesting.address);
      expect(balance).to.equal(600);
      balance = await xToken.balanceOf(bob.address);
      expect(balance).to.equal(400);

      // withdraw the rest and check balance
      await tokenVesting.connect(bob).withdraw(0, 600);
      soloVesting = await tokenVesting.soloVesting(0, bob.address);
      expect(soloVesting.grantAmount).to.equal(1000);
      expect(soloVesting.withdrawAmount).to.equal(1000);

      balance = await xToken.balanceOf(tokenVesting.address);
      expect(balance).to.equal(0);
      balance = await xToken.balanceOf(bob.address);
      expect(balance).to.equal(1000);

      vestingSched = await tokenVesting.vestingSched(0);
      expect(vestingSched.grantAmount).to.equal(1000);
      expect(vestingSched.withdrawAmount).to.equal(1000);

      // grant bob 2000 again
      await tokenVesting.grant(
        0,
        [bob.address],
        [2000]
      );
      balance = await xToken.balanceOf(tokenVesting.address);
      expect(balance).to.equal(2000);

      vestingSched = await tokenVesting.vestingSched(0);
      expect(vestingSched.grantAmount).to.equal(3000);
      expect(vestingSched.withdrawAmount).to.equal(1000);

      // check balance
      soloVesting = await tokenVesting.soloVesting(0, bob.address);
      expect(soloVesting.grantAmount).to.equal(3000);
      expect(soloVesting.withdrawAmount).to.equal(1000);

      // withdraw 200 and check balance
      await tokenVesting.connect(bob).withdraw(0, 200);
      soloVesting = await tokenVesting.soloVesting(0, bob.address);
      expect(soloVesting.grantAmount).to.equal(3000);
      expect(soloVesting.withdrawAmount).to.equal(1200);

      // withdraw 300 and check balance
      await tokenVesting.connect(bob).withdraw(0, 300);
      soloVesting = await tokenVesting.soloVesting(0, bob.address);
      expect(soloVesting.grantAmount).to.equal(3000);
      expect(soloVesting.withdrawAmount).to.equal(1500);

      // transfer 500 to darwin
      await tokenVesting.connect(bob).transfer(darwin.address, 0, 500);
      soloVesting = await tokenVesting.soloVesting(0, bob.address);
      expect(soloVesting.grantAmount).to.equal(2500);
      expect(soloVesting.withdrawAmount).to.equal(1500);

      soloVesting = await tokenVesting.soloVesting(0, darwin.address);
      expect(soloVesting.grantAmount).to.equal(500);
      expect(soloVesting.withdrawAmount).to.equal(0);

      balance = await xToken.balanceOf(tokenVesting.address);
      expect(balance).to.equal(1500);
      balance = await xToken.balanceOf(bob.address);
      expect(balance).to.equal(1500);
      balance = await xToken.balanceOf(darwin.address);
      expect(balance).to.equal(0);

      // withdraw all from bob and darwin
      await tokenVesting.connect(bob).withdraw(0, 1000);
      await tokenVesting.connect(darwin).withdraw(0, 500);

      soloVesting = await tokenVesting.soloVesting(0, bob.address);
      expect(soloVesting.grantAmount).to.equal(2500);
      expect(soloVesting.withdrawAmount).to.equal(2500);

      soloVesting = await tokenVesting.soloVesting(0, darwin.address);
      expect(soloVesting.grantAmount).to.equal(500);
      expect(soloVesting.withdrawAmount).to.equal(500);

      balance = await xToken.balanceOf(tokenVesting.address);
      expect(balance).to.equal(0);
      balance = await xToken.balanceOf(bob.address);
      expect(balance).to.equal(2500);
      balance = await xToken.balanceOf(darwin.address);
      expect(balance).to.equal(500);

      vestingSched = await tokenVesting.vestingSched(0);
      expect(vestingSched.grantAmount).to.equal(3000);
      expect(vestingSched.withdrawAmount).to.equal(3000);
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

    it("update vesting time", async () => {
      var currentTime = Math.floor(new Date() / 1000);
      var vestingScheds = await tokenVesting.allVestingScheds()
      expect(vestingScheds.length).to.equal(3);
      var vestingSched1 = await tokenVesting.vestingSched(0);
      expect(vestingSched1.vestingTime).not.gt(currentTime);
      var vestingSched2 = await tokenVesting.vestingSched(1);
      expect(vestingSched2.vestingTime).not.gt(currentTime);
      var vestingSched3 = await tokenVesting.vestingSched(2);
      expect(vestingSched3.vestingTime).not.gt(currentTime);

      // expect revert for bob
      await expectRevert(
        tokenVesting.connect(bob).updateVestingSchedTime(0, currentTime),
        "Caller is not a admin"
      );

      // should work for alice
      updatedTime = currentTime + 1000;
      await tokenVesting.connect(alice).updateVestingSchedTime(0, updatedTime);
      await tokenVesting.connect(alice).updateVestingSchedTime(1, updatedTime);
      await tokenVesting.connect(alice).updateVestingSchedTime(2, updatedTime);

      var vestingSched1 = await tokenVesting.vestingSched(0);
      expect(vestingSched1.vestingTime).to.equal(updatedTime);
      var vestingSched2 = await tokenVesting.vestingSched(1);
      expect(vestingSched2.vestingTime).to.equal(updatedTime);
      var vestingSched3 = await tokenVesting.vestingSched(2);
      expect(vestingSched3.vestingTime).to.equal(updatedTime);
    });

    it("should return all solo vestings", async () => {
      // setup solo vestings for bob
      await tokenVesting.connect(alice).grant(
        1,
        [bob.address],
        [1000]
      );
      await tokenVesting.connect(alice).grant(
        2,
        [bob.address],
        [1000]
      );

      // check all
      var soloVestings = await tokenVesting.allSoloVestings(bob.address);
      expect(soloVestings.length).to.equal(2);
      expect(soloVestings[0].grantAmount).to.equal(1000);
      expect(soloVestings[0].withdrawAmount).to.equal(0);
      expect(soloVestings[1].grantAmount).to.equal(1000);
      expect(soloVestings[1].withdrawAmount).to.equal(0);

      // check solo 
      var soloVesting1 = await tokenVesting.soloVesting(1, bob.address);
      expect(soloVesting1.grantAmount).to.equal(1000);
      expect(soloVesting1.withdrawAmount).to.equal(0);
      var soloVesting2 = await tokenVesting.soloVesting(2, bob.address);
      expect(soloVesting2.grantAmount).to.equal(1000);
      expect(soloVesting2.withdrawAmount).to.equal(0);
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
        tokenVesting.connect(bob).grantGranter(bob.address),
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
