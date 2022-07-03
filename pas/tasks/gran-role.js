task("grant-role", "Grant role to an address")
  .addParam("role", "The role string")
  .addParam("address", "The address grant role to")
  .setAction(async (taskArgs) => {
    const operator = web3.utils.toChecksumAddress(taskArgs.address);
    const xtoken = await ethers.getContract("XToken");
    const role = web3.utils.keccak256(taskArgs.role);

    console.log(`Sending the transaction to xtoken: ${xtoken.address} ...`);
    var tx = await xtoken.grantRole(role, operator);
    console.log(`Transaction hash: ${tx.hash}`);
    console.log("Waiting for confirmation (granting)...");
    var receipt = await tx.wait();
    console.log(`tx hash: ${tx.hash}, receipt status: ${receipt.status}`);

    var roleMembers = await xtoken.getRoleMembers(role);
    console.log(`Role members: ${roleMembers}`);
    console.log("All roles operator granted");
  });

module.exports = {};
