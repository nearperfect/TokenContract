task("accounts", "Check balance of the address")
  .setAction(async (taskArgs) => {
    const xtoken = await ethers.getContract("XToken");
    const signers = await ethers.getSigners();
    const [deployer, owner, alice, bob, charlie, darwin] = signers;
    const accounts = [deployer, owner, alice, bob, charlie, darwin];
    for (const account of accounts) {
      var balance = await xtoken.balanceOf(account.address);
      console.log(`Balance for ${account.address}: ${balance} `);
    }
  });

module.exports = {};