import { useState } from "react";
import { ethers } from "ethers";

const ConnectWallet = function () {
  const [walletAddress, setWalletAddress] = useState("");

  async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
    }
  }

  async function requestAccount() {
    console.log("Requesting account.....");

    if (window.ethereum) {
      console.log("detected");

      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log(accounts);
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.log("Error connecting....");
      }
    } else {
      console.log("Metamask not detected");
    }
  }

  return (
    <>
      <div className="ConnectWallet">
        <button onClick={requestAccount}>Connect Wallet</button>
        {walletAddress ? (
          <h3>Wallet Address: {walletAddress}</h3>
        ) : (
          <h3>Loading......</h3>
        )}
      </div>
    </>
  );
};

export default ConnectWallet;
