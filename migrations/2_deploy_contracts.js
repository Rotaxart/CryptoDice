const Counter = artifacts.require("Counter.sol");
module.exports = function (deployer) {
		deployer.deploy(Counter);
};
const Contract2 = artifacts.require("Contract2.sol");
module.exports = function (deployer) {
		deployer.deploy(Contract2);
};
const Dice = artifacts.require("Dice.sol");
module.exports = function (deployer) {
		deployer.deploy(Dice);
};
