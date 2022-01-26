import React, { useState, useEffect } from "react";
// import Market from "../contracts/NFTMarket.json";
// import LipToken from "../contracts/NFT.json";
import { getNativeByChain } from "../helpers/networks";
import { getCollectionsByChain } from "../helpers/collections";
import { useDispatch, useSelector } from "react-redux";
import { Card, Image, Tooltip, Modal, Badge, Alert, Spin } from "antd";
import LipRenderer from "../components/lipRenderer";
import { useNFTTokenIds } from "../hooks/useNFTTokenIds";
import { updateContract } from "../redux/blockchain/blockchainActions";
import { fetchData, fetchDataMarket } from "../redux/data/dataActions";
import {
  FileSearchOutlined,
  RightCircleOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { getExplorer } from "../helpers/networks";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
const { Meta } = Card;

const styles = {
  NFTs: {
    display: "flex",
    flexWrap: "wrap",
    WebkitBoxPack: "start",
    justifyContent: "flex-start",
    margin: "0 auto",
    maxWidth: "1000px",
    gap: "10px",
  },
  banner: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    margin: "0 auto",
    width: "600px",
    //borderRadius: "10px",
    height: "150px",
    marginBottom: "40px",
    paddingBottom: "20px",
    borderBottom: "solid 1px #e3e3e3",
  },
  logo: {
    height: "115px",
    width: "115px",
    borderRadius: "50%",
    // positon: "relative",
    // marginTop: "-80px",
    border: "solid 4px white",
  },
  text: {
    color: "#041836",
    fontSize: "27px",
    fontWeight: "bold",
  },
};

function NFTTokenIds({ inputValue, setInputValue }) {
  const web3 = new Web3(window.ethereum);
  const dispatch = useDispatch();
  const { active, account, library, connector, chainId } = useWeb3React();
  const fallbackImg =
    "data:image/png;base64,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";
  // const { NFTTokenIds, totalNFTs, fetchSuccess } = useNFTTokenIds(inputValue);
  const blockchain = useSelector((state) => state.blockchain);
  const dataMarket = useSelector((state) => state.dataMarket);
  const [visible, setVisibility] = useState(false);
  const [nftToBuy, setNftToBuy] = useState(null);
  const [loading, setLoading] = useState(false);

  const [NFTCollections, setNFTCollections] = useState(null);
  const [nativeName, setNativeName] = useState(null);

  // const contractABIJson = JSON.parse(contractABI);
  // const { Moralis } = useMoralis();
  // const queryMarketItems = useMoralisQuery("MarketItems");
  // const fetchMarketItems = JSON.parse(
  //   JSON.stringify(queryMarketItems.data, [
  //     "objectId",
  //     "createdAt",
  //     "price",
  //     "nftContract",
  //     "itemId",
  //     "sold",
  //     "tokenId",
  //     "seller",
  //     "owner",
  //     "confirmed",
  //   ])
  // );
  const purchaseItemFunction = "createMarketSale";
  
  // const loadW3Contract = async () => {
  //   try {
  //     const networkId = await window.ethereum.request({
  //       method: "net_version",
  //     });
  //     const lipTokenNetworkData = await LipToken.networks[networkId];
  //     const nftMarketNetworkData = await Market.networks[networkId];
  //     // console.log("lipTokenNetworkData", lipTokenNetworkData);
  //     const lipToken = new library.eth.Contract(
  //       LipToken.abi,
  //       lipTokenNetworkData.address
  //     );
  //     const nftMarket = new library.eth.Contract(
  //       Market.abi,
  //       nftMarketNetworkData.address
  //     );
  //     dispatch(
  //       updateContract({
  //         account: account,
  //         NFTToken: lipToken,
  //         nftMarket: nftMarket,
  //         web3: library,
  //       })
  //     );
  //   } catch (ex) {
  //     console.log(ex);
  //   }
  // };

  useEffect(() => {
    if (library != undefined) {
      setNativeName(getNativeByChain(library.utils.toHex(chainId)));
      setNFTCollections(getCollectionsByChain(library.utils.toHex(chainId)));
    }
    // if (library != undefined && blockchain.market == null) {
    //   loadW3Contract();
    // }
  }, [library]);

  useEffect(() => {
    if (account != "" && blockchain.nftMarket != null) {
      dispatch(fetchDataMarket(account));
    }
  }, [blockchain.nftMarket]);

  const handleBuyClick = (nft) => {
    setNftToBuy(nft);
    setVisibility(true);
  };

  const getMarketItem = (nft) => {
    if (nft != null && nft.sold === false && nft.seller !== account) {
      return nft;
    } else {
      return false;
    }
  };

  const buyNFT = (_account, _item) => {
    setLoading(true);
    // console.log('_item', _item);
    blockchain.market.methods
      .createMarketSale(_item.nftContract, _item.itemId)
      .send({
        from: _account,
        value: blockchain.web3.utils.toWei(
          library.web3.utils.fromWei(_item.price, "ether").toString(),
          "ether"
        ),
      })
      .once("error", (err) => {
        setLoading(false);
        setVisibility(false);
        console.log(err);
      })
      .then((receipt) => {
        setLoading(false);
        setVisibility(false);
        console.log(receipt);
        dispatch(fetchData(blockchain.account));
        dispatch(fetchDataMarket(blockchain.account));
      });
  };
  return (
    <>
      <div>
        <div style={styles.NFTs}>
          {inputValue === "explore" &&
            NFTCollections?.map((nft, index) => (
              <Card
                hoverable
                actions={[
                  <Tooltip title="View Collection">
                    <RightCircleOutlined
                      onClick={() => setInputValue(nft?.addrs)}
                    />
                  </Tooltip>,
                ]}
                style={{ width: 240, border: "2px solid #e7eaf3" }}
                cover={
                  <Image
                    preview={false}
                    src={nft?.image || "error"}
                    fallback={fallbackImg}
                    alt=""
                    style={{ height: "240px" }}
                  />
                }
                key={index}
              >
                <Meta title={nft.name} />
              </Card>
            ))}

          {inputValue !== "explore" &&
            dataMarket.allMarkets.slice(0, 20).map((nft, index) => (
              <Card
                hoverable
                actions={[
                  <Tooltip title="View On Blockexplorer">
                    <FileSearchOutlined
                      onClick={() =>
                        window.open(
                          `${getExplorer(
                            library.utils.toHex(chainId)
                          )}address/${nft.nftContract}`,
                          "_blank"
                        )
                      }
                    />
                  </Tooltip>,
                  <Tooltip title="Buy NFT">
                    <ShoppingCartOutlined onClick={() => handleBuyClick(nft)} />
                  </Tooltip>,
                ]}
                style={{ width: 240, border: "2px solid #e7eaf3" }}
                cover={
                  <LipRenderer lip={nft} />
                  // <Image
                  //   preview={false}
                  //   src={nft.image || "error"}
                  //   fallback={fallbackImg}
                  //   alt=""
                  //   style={{ height: "240px" }}
                  // />
                }
                key={index}
              >
                {getMarketItem(nft) && (
                  <Badge.Ribbon text="Buy Now" color="green"></Badge.Ribbon>
                )}
                <Meta
                  title={nft.tokenId}
                  description={`#${web3.utils.fromWei(
                    nft.price,
                    "ether"
                  )} ETH`}
                />
              </Card>
            ))}
        </div>

        {getMarketItem(nftToBuy) ? (
          <Modal
            title={`Buy ${nftToBuy?.itemId} #${nftToBuy?.tokenId}`}
            visible={visible}
            onCancel={() => setVisibility(false)}
            onOk={() => buyNFT(account, nftToBuy)}
            okText="Buy"
          >
            <Spin spinning={loading}>
              <div
                style={{
                  width: "250px",
                  margin: "auto",
                }}
              >
                <Badge.Ribbon
                  color="green"
                  text={`${
                    getMarketItem(nftToBuy).price / ("1e" + 18)
                  } ${nativeName}`}
                >
                  <img
                    src={nftToBuy?.image}
                    style={{
                      width: "250px",
                      borderRadius: "10px",
                      marginBottom: "15px",
                    }}
                  />
                </Badge.Ribbon>
              </div>
            </Spin>
          </Modal>
        ) : (
          <Modal
            title={`Buy ${nftToBuy?.itemId} #${nftToBuy?.tokenId}`}
            visible={visible}
            onCancel={() => setVisibility(false)}
            onOk={() => setVisibility(false)}
          >
            <img
              src={nftToBuy?.image}
              style={{
                width: "250px",
                margin: "auto",
                borderRadius: "10px",
                marginBottom: "15px",
              }}
            />
            <Alert
              message="This NFT is currently not for sale"
              type="warning"
            />
          </Modal>
        )}
      </div>
    </>
  );
}

export default NFTTokenIds;
