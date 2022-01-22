const LipToken = artifacts.require("LipToken");
const Market = artifacts.require("Market");
const NFT = artifacts.require("NFT");

module.exports = function (deployer) {
  deployer.deploy(LipToken, "LipTokens", "LIPS");
  deployer.deploy(Market);
};
