const ControlFichaje = artifacts.require("ControlFichaje");

module.exports = async (deployer) => {
    await deployer.deploy(ControlFichaje);
};
