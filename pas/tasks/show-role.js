task("show-role", "Show members' addresses of the role")
  .addParam("role", "The role string")
  .setAction(async (taskArgs) => {
    const operator = web3.utils.toChecksumAddress(taskArgs.address);
    const xtoken = await ethers.getContract("XToken");
    var role = ""
    if (taskArgs.role == "DEFAULT_ADMIN_ROLE") {
      role = "0x0000000000000000000000000000000000000000000000000000000000000000"
    } else {
      role = web3.utils.keccak256(taskArgs.role);
    }
    var roleMembers = await xtoken.getRoleMembers(role);
    console.log(`Role ${taskArgs.role} members: ${roleMembers}`);
  });

module.exports = {};
