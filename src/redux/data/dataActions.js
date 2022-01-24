// log
import store from "../store";

const fetchDataRequest = () => {
  return {
    type: "CHECK_DATA_REQUEST",
  };
};

const fetchDataSuccess = (payload) => {
  return {
    type: "CHECK_DATA_SUCCESS",
    payload: payload,
  };
};

const fetchDataFailed = (payload) => {
  return {
    type: "CHECK_DATA_FAILED",
    payload: payload,
  };
};

export const fetchData = (account) => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {
      let allLips = await store
        .getState()
        .blockchain.NFTToken.methods.getLips()
        .call();
      let allOwnerLips = await store
        .getState()
        .blockchain.NFTToken.methods.getOwnerLips(account)
        .call();

      dispatch(
        fetchDataSuccess({
          allLips,
          allOwnerLips,
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};

const fetchDataMarketRequest = () => {
  return {
    type: "CHECK_DATA_MARKET_REQUEST",
  };
};

const fetchDataMarketSuccess = (payload) => {
  return {
    type: "CHECK_DATA_MARKET_SUCCESS",
    payload: payload,
  };
};

const fetchDataMarketFailed = (payload) => {
  return {
    type: "CHECK_DATA_MARKET_FAILED",
    payload: payload,
  };
};

export const fetchDataMarket = (account) => {
  return async (dispatch) => {
    dispatch(fetchDataMarketRequest());
    try {
      let allMarkets = await store
        .getState()
        .blockchain.nftMarket.methods.fetchMarketItems()
        .call();
      let allOwnerMarkets = await store
        .getState()
        .blockchain.nftMarket.methods.fetchMarketItems()
        // .blockchain.market.methods.fetchMarketItems(account)
        .call();
      // console.log("allMarkets", allMarkets);
      dispatch(
        fetchDataMarketSuccess({
          allMarkets,
          allOwnerMarkets,
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataMarketFailed("Could not load data from contract."));
    }
  };
};
