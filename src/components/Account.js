import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEllipsisTxt } from "../helpers/formatters";
import Blockie from "./Blockie";
import { Button, Card, Modal } from "antd";
import Address from "./Address/Address";
import { SelectOutlined } from "@ant-design/icons";
import { getExplorer } from "../helpers/networks";
import { updateContract } from "../redux/blockchain/blockchainActions";

import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import { injected } from "../connectors";

const styles = {
  account: {
    height: "42px",
    padding: "0 15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "fit-content",
    borderRadius: "12px",
    backgroundColor: "rgb(244, 244, 244)",
    cursor: "pointer",
  },
  text: {
    color: "#21BF96",
  },
};

function Account() {
  const web3 = new Web3(window.ethereum);
  const dispatch = useDispatch();
  const { active, account, 
    // library, connector,
     activate, deactivate, chainId } =
    useWeb3React();
  // const blockchain = useSelector((state) => state.blockchain);
  // const networkId = web3.eth.net.getId();
  const [isModalVisible, setIsModalVisible] = useState(false);
  // const [chainId, setIsChainId] = useState(null);
  // const getChainId = async () => {
  //   setIsChainId(await web3.eth.getChainId());
  // };
  console.log('chainId',chainId);
  const willMount = useRef(true);
  if (willMount.current) {
    // getChainId();
    activate(injected);
    willMount.current = false;
  }

  // useEffect(() => {
  //   if(account != null){
  //     updateContract();
  //   }
  // }, account)

  const connect = async () => {
    try {
      // const accounts = await web3.eth.requestAccounts();
      // console.log('accounts', accounts);
      await activate(injected);
    } catch (ex) {
      console.log(ex);
    }
  };

  const disconnect = () => {
    try {
      deactivate();
    } catch (ex) {
      console.log(ex);
    }
  };

  if (!active) {
    return (
      <div
        style={styles.account}
        onClick={
          connect
          // () => {
          //   dispatch(connect());
          // }
          // authenticate({ signingMessage: "Hello World!" })
        }
      >
        <p style={styles.text}>Authenticate</p>
      </div>
    );
  } else {
    return (
      <>
        <div style={styles.account} onClick={() => setIsModalVisible(true)}>
          <p style={{ marginRight: "5px", ...styles.text }}>
            {getEllipsisTxt(account, 6)}
          </p>
          <Blockie currentWallet scale={3} />
        </div>
        <Modal
          visible={isModalVisible}
          footer={null}
          onCancel={() => setIsModalVisible(false)}
          bodyStyle={{
            padding: "15px",
            fontSize: "17px",
            fontWeight: "500",
          }}
          style={{ fontSize: "16px", fontWeight: "500" }}
          width="400px"
        >
          Account
          <Card
            style={{
              marginTop: "10px",
              borderRadius: "1rem",
            }}
            bodyStyle={{ padding: "15px" }}
          >
            <Address
              avatar="left"
              size={6}
              copyable
              style={{ fontSize: "20px" }}
            />
            <div style={{ marginTop: "10px", padding: "0 10px" }}>
              <a
                href={`${getExplorer(
                  web3.utils.toHex(chainId)
                )}address/${account}`}
                target="_blank"
                rel="noreferrer"
              >
                <SelectOutlined style={{ marginRight: "5px" }} />
                View on Explorer
              </a>
            </div>
          </Card>
          <Button
            size="large"
            type="primary"
            style={{
              width: "100%",
              marginTop: "10px",
              borderRadius: "0.5rem",
              fontSize: "16px",
              fontWeight: "500",
            }}
            onClick={() => {
              disconnect();
              setIsModalVisible(false);
            }}
          >
            Disconnect Wallet
          </Button>
        </Modal>
      </>
    );
  }
}

export default Account;
