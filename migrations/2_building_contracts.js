var BuildingOwnership = artifacts.require("./BuildingOwnership.sol");

module.exports = function(deployer) {
  deployer.deploy(BuildingOwnership);
};
