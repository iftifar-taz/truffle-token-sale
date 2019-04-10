const ItToken = artifacts.require("ItToken");

module.exports = function(deployer) {
  deployer.deploy(ItToken);
};
