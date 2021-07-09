const UsersContract = artifacts.require("UsersContract");

module.exports = async (deployer) => {
    await deployer.deploy(UsersContract);
};
