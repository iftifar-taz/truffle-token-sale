const ItToken = artifacts.require("ItToken");

module.exports = function(deployer) {
  deployer.deploy(ItToken, 1000000000);
};
