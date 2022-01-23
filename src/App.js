import React, { useEffect, useState } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData, fetchDataMarket } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import LipRenderer from "./components/lipRenderer";
import _color from "./assets/images/bg/_color.png";

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const dataMarket = useSelector((state) => state.dataMarket);
  const [loading, setLoading] = useState(false);

  // console.log("blockchain", blockchain);
  // console.log('data', data);
  // console.log("dataMarket", dataMarket);

  const mintNFT = (_account, _name) => {
    console.log("_account", _account);
    setLoading(true);
    blockchain.lipToken.methods
      .createRandomLip(_name)
      .send({
        from: _account,
        value: blockchain.web3.utils.toWei("0.01", "ether"),
        // value: 100*10000000000000000,
      })
      .once("error", (err) => {
        setLoading(false);
        console.log(err);
      })
      .then((receipt) => {
        setLoading(false);
        console.log(receipt);
        dispatch(fetchData(blockchain.account));
        dispatch(fetchDataMarket(blockchain.account));
      });
  };

  const levelUpLip = (_account, _id) => {
    setLoading(true);
    blockchain.lipToken.methods
      .levelUp(_id)
      .send({
        from: _account,
      })
      .once("error", (err) => {
        setLoading(false);
        console.log(err);
      })
      .then((receipt) => {
        setLoading(false);
        console.log(receipt);
        dispatch(fetchData(blockchain.account));
      });
  };
  const approve = (_account, _id) => {
    setLoading(true);
    blockchain.lipToken.methods
      .approve(blockchain.market._address, _id)
      .send({
        from: _account,
      })
      .once("error", (err) => {
        setLoading(false);
        console.log(err);
      })
      .then((receipt) => {
        setLoading(false);
        console.log(receipt);
        dispatch(fetchData(blockchain.account));
      });
  };
  const sell = (_account, _item, _price) => {
    setLoading(true);
    blockchain.market.methods
      .createMarketItem(
        blockchain.lipToken._address,
        _item.id,
        blockchain.web3.utils.toWei(_price.toString(), "ether")
      )
      .send({
        from: _account,
        value: blockchain.web3.utils.toWei("0.3", "ether"),
      })
      .once("error", (err) => {
        setLoading(false);
        console.log(err);
      })
      .then((receipt) => {
        setLoading(false);
        console.log(receipt);
        dispatch(fetchData(blockchain.account));
        dispatch(fetchDataMarket(blockchain.account));
      });
  };

  const buy = (_account, _item) => {
    setLoading(true);
    // console.log('_item', _item);
    blockchain.market.methods
      .createMarketSale(_item.nftContract, _item.itemId)
      .send({
        from: _account,
        value: blockchain.web3.utils.toWei(
          blockchain.web3.utils.fromWei(_item.price, "ether").toString(),
          "ether"
        ),
      })
      .once("error", (err) => {
        setLoading(false);
        console.log(err);
      })
      .then((receipt) => {
        setLoading(false);
        console.log(receipt);
        dispatch(fetchData(blockchain.account));
        dispatch(fetchDataMarket(blockchain.account));
      });
  };

  useEffect(() => {
    if (blockchain.account != "" && blockchain.lipToken != null) {
      dispatch(fetchData(blockchain.account));
    }
  }, [blockchain.lipToken]);

  useEffect(() => {
    if (blockchain.account != "" && blockchain.market != null) {
      dispatch(fetchDataMarket(blockchain.account));
    }
  }, [blockchain.market]);

  return (
    <s.Screen image={_color}>
      {blockchain.account === "" || blockchain.lipToken === null ? (
        <s.Container flex={1} ai={"center"} jc={"center"}>
          <s.TextTitle>Connect to the game</s.TextTitle>
          <s.SpacerSmall />
          <button
            onClick={(e) => {
              e.preventDefault();
              dispatch(connect());
            }}
          >
            CONNECT
          </button>
          <s.SpacerXSmall />
          {blockchain.errorMsg != "" ? (
            <s.TextDescription>{blockchain.errorMsg}</s.TextDescription>
          ) : null}
        </s.Container>
      ) : (
        <s.Container ai={"center"} style={{ padding: "24px" }}>
          <s.TextTitle>Welcome to the game: {blockchain.account}</s.TextTitle>
          <s.SpacerSmall />
          <button
            disabled={loading ? 1 : 0}
            onClick={(e) => {
              e.preventDefault();
              mintNFT(blockchain.account, "Daniel");
            }}
          >
            CREATE NFT LIP
          </button>
          <s.SpacerMedium />
          <s.Container jc={"center"} fd={"row"} style={{ flexWrap: "wrap" }}>
            {data.allOwnerLips.map((item, index) => {
              return (
                <s.Container key={index} style={{ padding: "15px" }}>
                  <LipRenderer lip={item} />
                  <s.SpacerXSmall />
                  <s.Container>
                    <s.TextDescription>ID: {item.id}</s.TextDescription>
                    <s.TextDescription>DNA: {item.dna}</s.TextDescription>
                    <s.TextDescription>LEVEL: {item.level}</s.TextDescription>
                    <s.TextDescription>NAME: {item.name}</s.TextDescription>
                    <s.TextDescription>RARITY: {item.rarity}</s.TextDescription>
                    <s.SpacerXSmall />
                    <button
                      disabled={loading ? 1 : 0}
                      onClick={(e) => {
                        e.preventDefault();
                        levelUpLip(blockchain.account, item.id);
                      }}
                    >
                      Level Up
                    </button>
                    <button
                      disabled={loading ? 1 : 0}
                      onClick={(e) => {
                        e.preventDefault();
                        approve(blockchain.account, item.id);
                      }}
                    >
                      approve
                    </button>
                    <button
                      disabled={loading ? 1 : 0}
                      onClick={(e) => {
                        e.preventDefault();
                        sell(blockchain.account, item, 0.1);
                      }}
                    >
                      Sell
                    </button>
                  </s.Container>
                </s.Container>
              );
            })}
          </s.Container>
          <s.TextTitle>Market: {blockchain.account}</s.TextTitle>
          <s.SpacerSmall />
          <s.Container jc={"center"} fd={"row"} style={{ flexWrap: "wrap" }}>
            {dataMarket.allMarkets.map((item, index) => {
              return (
                <s.Container key={index} style={{ padding: "15px" }}>
                  <LipRenderer lip={item} />
                  <s.SpacerXSmall />
                  <s.Container>
                    <s.TextDescription>ID: {item.tokenId}</s.TextDescription>
                    <s.TextDescription>User: {item.seller}</s.TextDescription>
                    <s.TextDescription>DNA: {item.dna}</s.TextDescription>
                    <s.TextDescription>LEVEL: {item.level}</s.TextDescription>
                    <s.TextDescription>NAME: {item.name}</s.TextDescription>
                    <s.TextDescription>RARITY: {item.rarity}</s.TextDescription>
                    <s.TextDescription>
                      Status: {item.sold === true ? "đã bán" : "chưa bán"}
                    </s.TextDescription>
                    <s.TextDescription>
                      Price:{" "}
                      {blockchain.web3.utils.fromWei(item.price, "ether")}
                    </s.TextDescription>
                    <s.SpacerXSmall />
                    {item.seller.toString() !=
                      blockchain.account.toString() && (
                      <button
                        disabled={loading ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          buy(blockchain.account, item);
                        }}
                      >
                        Buy
                      </button>
                    )}
                  </s.Container>
                </s.Container>
              );
            })}
          </s.Container>
        </s.Container>
      )}
    </s.Screen>
  );
}

export default App;
