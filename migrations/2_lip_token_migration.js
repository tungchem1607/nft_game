const NFT = artifacts.require("NFT");
const NFTMarket = artifacts.require("NFTMarket");

module.exports = function (deployer) {
  deployer.deploy(NFT, "LipTokens", "LIPS");
  deployer.deploy(NFTMarket);
};
