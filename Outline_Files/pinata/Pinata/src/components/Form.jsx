import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import User from "../user.json";

const Form = function () {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [jsonDisplay, setJsonDisplay] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [contract, setContract] = useState(null);
  const [data, setData] = useState("");
  const [jsonCid, setJsonCid] = useState("");

  const contractAddress = "0x9Fd714A1E536d0fF5D7670BD9E4727b9194A299e";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const downloadJSON = async (jsonData) => {
    try {
      const blob = new Blob([jsonData], { type: "application/json" });
      const formData = new FormData();
      formData.append("file", blob, "formData.json");

      const metadata = JSON.stringify({
        name: "JSON Metadata",
      });
      formData.append("pinataMetadata", metadata);

      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append("pinataOptions", options);

      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
          },
          body: formData,
        }
      );

      const resData = await res.json();
      setJsonCid(resData.IpfsHash);
      console.log("JSON CID:", resData.IpfsHash);
      return resData.IpfsHash;
    } catch (error) {
      console.log("Error uploading JSON to IPFS:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const jsonData = JSON.stringify(formData, null, 2);
    const cid = await downloadJSON(jsonData);
    setJsonDisplay(JSON.parse(jsonData));
    await pushToChain(cid);
    await fetchJSON(cid);
  };

  const fetchJSON = async function (jsonCid) {
    const gatewayUrl = `${import.meta.env.VITE_GATEWAY_URL}/ipfs/${jsonCid}`;
    try {
      const dataResponse = await fetch(gatewayUrl);
      if (dataResponse.ok) {
        const jsonData = await dataResponse.json();
        setData(jsonData);
      } else {
        console.error("Failed to fetch JSON data:", dataResponse.statusText);
      }
    } catch (error) {
      console.error("Failed to fetch JSON data:", error);
    }
  };

  const pushToChain = async function (ipfsHash) {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);

        const provider = new ethers.providers.Web3Provider(
          window.ethereum,
          "any"
        );
        const signer = provider.getSigner();

        const contractz = new ethers.Contract(
          contractAddress,
          User.abi,
          signer
        );
        setContract(contractz);

        const tx = await contract.storeUserHash(ipfsHash);
        await tx.wait();
        console.log("Transaction confirmed:", tx);
      } catch (error) {
        console.log("Error connecting or storing hash:", error);
      }

      getHash();
    } else {
      console.log("MetaMask not detected");
    }
  };

  const getHash = async function () {
    if (contract) {
      try {
        const hash = await contract.getUserHash(walletAddress);
        console.log("Retrieved hash:", hash);
      } catch (error) {
        console.error("Error getting hash:", error);
      }
    } else {
      console.log("Contract not initialized");
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Message:
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
            />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
      {data && (
        <>
          <h2>JSON Data:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </>
      )}
    </div>
  );
};

export default Form;
