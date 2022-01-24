// import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
// import { useMoralis } from "react-moralis";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEllipsisTxt } from "../helpers/formatters";
import Blockie from "./Blockie";
import { Button, Card, Modal } from "antd";
import Address from "./Address/Address";
import { SelectOutlined } from "@ant-design/icons";
import { getExplorer } from "../helpers/networks";
// import { connect } from "../redux/blockchain/blockchainActions";

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
  // const { walletAddress, chainId } = useMoralisDapp();
  const { active, account, library, connector, activate, deactivate } =
    useWeb3React();
  const blockchain = useSelector((state) => state.blockchain);
  const chainId = web3.eth.getChainId();
  // const { authenticate, isAuthenticated, logout } = null;
  const [isModalVisible, setIsModalVisible] = useState(false);
  console.log("active", active);
  console.log("account", account);
  const connect = async () => {
    try {
      console.log(1231);
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
            {getEllipsisTxt(walletAddress, 6)}
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
              {console.log(
                `${getExplorer(chainId)}/address/${blockchain.account}`
              )}
              <a
                href={`${getExplorer(chainId)}/address/${blockchain.account}`}
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
