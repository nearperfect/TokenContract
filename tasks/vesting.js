const { BN } = require("@openzeppelin/test-helpers");

task("vesting", "check vesting").setAction(async (taskArgs) => {
  const signers = await ethers.getSigners();
  const [deployer, owner, alice, bob, charlie, darwin] = signers;
  const xtoken = await ethers.getContract("XToken");
  const tokenVesting = await ethers.getContract("TokenVesting");
  const BNCOIN = new BN("1000000000000000000");
  var amount = ethers.BigNumber.from(BNCOIN.mul(new BN(1000000)).toString());

  console.log(
    `Sending mint transaction to xtoken: ${xtoken.address}, receiver: ${
      alice.address
    }, amount ${amount.toString()} ...`
  );

  var tx = await xtoken.mint(alice.address, amount);
  console.log(`Transaction hash: ${tx.hash}`);
  console.log("Waiting for confirmation (minting)...");
  var receipt = await tx.wait();
  console.log(`tx hash: ${tx.hash}, receipt status: ${receipt.status}`);

  var balance = await xtoken.balanceOf(tokenVesting.address);
  console.log(`tokenVesting: ${balance}`);
  balance = await xtoken.balanceOf(alice.address);
  console.log(`alice: ${balance}`);
  balance = await xtoken.balanceOf(bob.address);
  console.log(`bob: ${balance}`);
  balance = await xtoken.balanceOf(darwin.address);
  console.log(`darwin: ${balance}`);

  tx = await xtoken.connect(alice).approve(tokenVesting.address, amount);
  receipt = await tx.wait();
  console.log(`xtoken: alice approve tokenVesting for ${amount.toString()}`);

  var allowance = await xtoken.allowance(alice.address, tokenVesting.address);
  console.log(`allowance: ${allowance}`);
  amount = ethers.BigNumber.from(BNCOIN.mul(new BN(500000)).toString());
  tx = await tokenVesting.grant(
    0,
    [bob.address, charlie.address],
    [amount, amount]
  );
  await tx.wait();
  console.log("granted");

  amount = ethers.BigNumber.from(BNCOIN.mul(new BN(500000)).toString());
  tx = await tokenVesting.connect(bob).transfer(0, darwin.address, amount);
  await tx.wait();
  console.log("transfered");

  amount = ethers.BigNumber.from(BNCOIN.mul(new BN(100000)).toString());
  tx = await tokenVesting.connect(darwin).withdraw(0, amount);
  await tx.wait();
  amount = ethers.BigNumber.from(BNCOIN.mul(new BN(100000)).toString());
  tx = await tokenVesting.connect(bob).withdraw(0, amount);
  await tx.wait();
  console.log("withdrawed");

  var balance = await xtoken.balanceOf(tokenVesting.address);
  console.log(`tokenVesting: ${balance}`);
  balance = await xtoken.balanceOf(alice.address);
  console.log(`alice: ${balance}`);
  balance = await xtoken.balanceOf(bob.address);
  console.log(`bob: ${balance}`);
  balance = await xtoken.balanceOf(darwin.address);
  console.log(`darwin: ${balance}`);
});

module.exports = {};
