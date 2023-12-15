task("balance", "Check balance of the address")
  .addParam("address", "Target address")
  .setAction(async (taskArgs) => {
    const xtoken = await ethers.getContract("XToken");
    var balance = await xtoken.balanceOf(taskArgs.address);
    console.log(`Balance for ${taskArgs.address}: ${balance} `);
  });

module.exports = {};