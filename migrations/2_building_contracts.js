var BuildingFactory = artifacts.require("./BuildingFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(BuildingFactory);
};
