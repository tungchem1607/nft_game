// constants
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";

import LipToken from "../../contracts/NFT.json";
import Market from "../../contracts/NFTMarket.json";
// log
import { fetchData } from "../data/dataActions";

const connectRequest = () => {
  return {
    type: "CONNECTION_REQUEST",
  };
};

const connectSuccess = (payload) => {
  return {
    type: "CONNECTION_SUCCESS",
    payload: payload,
  };
};

const connectFailed = (payload) => {
  return {
    type: "CONNECTION_FAILED",
    payload: payload,
  };
};

const updateAccountRequest = (payload) => {
  return {
    type: "UPDATE_ACCOUNT",
    payload: payload,
  };
};

export const connect = () => {
  return async (dispatch) => {
    dispatch(connectRequest());
    if (window.ethereum) {
      let web3 = new Web3(window.ethereum);
      try {
        const accounts = await web3.eth.requestAccounts();
        // await  window.ethereum.request({
        //   method: "eth_accounts",
        // });
        const networkId = await window.ethereum.request({
          method: "net_version",
        });
        // console.log(accounts);
        // console.log(networkId);
        if (networkId === 137) {
          const lipToken = new web3.eth.Contract(
            LipToken.abi,
            "0x247700BBab4dC984547444eCaa95f4E3Ed5dEC74"
          );
          dispatch(
            connectSuccess({
              account: accounts[0],
              lipToken: lipToken,
              web3: web3,
            })
          );
          // Add listeners start
          window.ethereum.on("accountsChanged", (accounts) => {
            dispatch(updateAccount(accounts[0]));
          });
          window.ethereum.on("chainChanged", () => {
            window.location.reload();
          });
          // Add listeners end
        } else if (networkId === 5777) {
          const lipTokenNetworkData = await LipToken.networks[networkId];
          const nftMarketNetworkData = await Market.networks[networkId];
          // console.log("lipTokenNetworkData", lipTokenNetworkData);
          const lipToken = new web3.eth.Contract(
            LipToken.abi,
            lipTokenNetworkData.address
          );
          const nftMarket = new web3.eth.Contract(
            Market.abi,
            nftMarketNetworkData.address
          );
          dispatch(
            connectSuccess({
              account: accounts[0],
              lipToken: lipToken,
              market: nftMarket,
              web3: web3,
            })
          );
          // Add listeners start
          window.ethereum.on("accountsChanged", (accounts) => {
            dispatch(updateAccount(accounts[0]));
          });
          window.ethereum.on("chainChanged", () => {
            window.location.reload();
          });
          // Add listeners end
        } else {
          dispatch(connectFailed("Change network to Polygon."));
        }
      } catch (err) {
        dispatch(connectFailed("Something went wrong."));
      }
    } else {
      dispatch(connectFailed("Install Metamask."));
    }
  };
};

export const updateContract = (options) => {
  return async (dispatch) => {
    dispatch(connectRequest());
    // console.log("options", options);
    dispatch(connectSuccess(options));
  };
};

export const updateAccount = (account) => {
  return async (dispatch) => {
    dispatch(updateAccountRequest({ account: account }));
    dispatch(fetchData(account));
  };
};
