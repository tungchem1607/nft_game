const NFT = artifacts.require("NFT");
// const NFTMarket = artifacts.require("NFTMarket");
// const NFTBEP20 = artifacts.require("NFTBEP20");
const NFTBep20Build = artifacts.require("NFTBep20Build");
const NFTMarketBEP20 = artifacts.require("NFTMarketBEP20");

module.exports = function (deployer) {
  // deployer.deploy(NFT, "LipTokens", "LIPS");
  // deployer.deploy(NFTMarket);
  // deployer.deploy(NFTBEP20);
  deployer.deploy(NFTBep20Build);
  deployer.deploy(NFTMarketBEP20);
};
