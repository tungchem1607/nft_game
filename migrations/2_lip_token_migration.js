const NFT = artifacts.require("NFT");
const NFTMarket = artifacts.require("NFTMarket");
// const BEP20Token = artifacts.require("BEP20Token");

module.exports = function (deployer) {
  // deployer.deploy(BEP20Token);
  deployer.deploy(NFT, "LipTokens", "LIPS");
  deployer.deploy(NFTMarket);
};
