import "./App.css";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import FaucetAbi from "./abis/Faucet.json";
import Swal from "sweetalert2";

const faucetContractAddress = "0xaFaFEdC492419d59aC13f032e4770559AF013526";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [provider, setProvider] = useState("");

  useEffect(() => {connectWallet();}, [walletAddress]);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts");
        setProvider(provider);
        setWalletAddress(accounts[0]);
        console.log(accounts);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getTokens = async () => {
    try {
      const contract = new ethers.Contract(
        faucetContractAddress,
        FaucetAbi,
        provider.getSigner()
      );

      const transaction = await contract.requestToken();

      if (transaction.hash) {
        Swal.fire({
          title: "Success!",
          html: `Check Your <b>Wallet</b>,
          '<a href="https://sepolia.etherscan.io/tx/${transaction.hash}" target="_blank" rel="noopener noreferrer">ETH TX Hash</a> '
          'at Etherscan`,
          icon: "success",
          confirmButtonText: "Ok",
        });
      }
      console.log("transaction", transaction);
    } catch (error) {
      const regex = /reason="([^"]+)"/;

      Swal.fire({
        title: error.message.match(regex) == null ? "Transaction Failed" : error.message.match(regex)[0],
        text: "Do you want to continue",
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <div className="navbar-brand">
            <h1 className="navbar-item is-size-4">MyToken (MTK) Faucet</h1>
          </div>
          <div id="navbar-menu" className="navbar-menu">
            <div className="navbar-end">
              <button
                className="button is-white connect-wallet"
                onClick={connectWallet}
              >
                {walletAddress
                  ? `Connected: ${walletAddress.substring(
                      0,
                      6
                    )}...${walletAddress.substring(38)}`
                  : "Connect Wallet"}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="faucet-hero-body">
          <div className="box">
            <input
              defaultValue={walletAddress}
              className="input"
              placeholder="Enter Your Wallet Address (0x...)"
              type="text"
            />
            <button onClick={getTokens}>Get Tokens</button>
          </div>
        </div>
      </section>
    </>
  );
}

export default App;
