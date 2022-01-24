import Blockies from "react-blockies";
import Web3 from "web3";
// import { useMoralisDapp } from "../providers/MoralisDappProvider/MoralisDappProvider";

/**
 * Shows a blockie image for the provided wallet address
 * @param {*} props
 * @returns <Blockies> JSX Elemenet
 */

function Blockie(props) {
  // const { walletAddress } = useMoralisDapp();
  let web3 = new Web3(window.ethereum);
  const { walletAddress } = web3.eth.requestAccounts();
  if ((!props.address && !props.currentWallet) || !walletAddress) return null;

  return (
    <Blockies
      seed={props.currentWallet ? walletAddress.toLowerCase() : props.address.toLowerCase()}
      className="identicon"
      {...props}
    />
  );
}

export default Blockie;
