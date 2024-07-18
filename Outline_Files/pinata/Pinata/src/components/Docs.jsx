import React, { useState } from "react";
import { ethers } from "ethers";
import DocContractABI from "../doc.json"; // Import the ABI of the doc contract

const MyForm = () => {
  const [formData, setFormData] = useState({
    ipfsHASH: "",
    amount: "",
    des: "",
    docType: "",
    header: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("file", file);

    const metadata = JSON.stringify({
      name: file.name,
    });
    uploadData.append("pinataMetadata", metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    uploadData.append("pinataOptions", options);

    try {
      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
          },
          body: uploadData,
        }
      );

      const resData = await res.json();
      setFormData((prevData) => ({
        ...prevData,
        ipfsHASH: resData.IpfsHash,
      }));
      console.log("IPFS Hash:", resData.IpfsHash);
    } catch (error) {
      console.error("Error uploading file to IPFS:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Connect to the Ethereum network and your smart contract
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        // Replace with your doc contract address
        const docContractAddress = "0x32e4488Eb7B94c75aCcBF58C169a82B548683363";
        const docContract = new ethers.Contract(
          docContractAddress,
          DocContractABI.abi,
          signer
        );

        // Call the addToBlockchain function from your doc contract
        const tx = await docContract.addToBlockchain(
          formData.ipfsHASH,
          ethers.utils.parseEther(formData.amount.toString()), // Assuming amount is in ETH
          formData.des,
          formData.docType,
          formData.header
        );

        await tx.wait();
        console.log("Transaction confirmed:", tx);

        // Clear form data after successful submission
        setFormData({
          ipfsHASH: "",
          amount: "",
          des: "",
          docType: "",
          header: "",
        });
      } catch (error) {
        console.error(
          "Error connecting to contract or sending transaction:",
          error
        );
      }
    } else {
      console.log("MetaMask not detected");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Upload File:
          <input type="file" onChange={handleFileUpload} required />
        </label>
      </div>
      <div>
        <label>
          Amount:
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Description:
          <input
            type="text"
            name="des"
            value={formData.des}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Document Type:
          <input
            type="text"
            name="docType"
            value={formData.docType}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Header:
          <input
            type="text"
            name="header"
            value={formData.header}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default MyForm;
