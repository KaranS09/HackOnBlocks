import React, { useState } from "react";
import { ethers } from "ethers";
import DocContractABI from "./doc.json"; // Ensure you have the ABI file

import "./modal.css";

const docContractAddress = "0x32e4488Eb7B94c75aCcBF58C169a82B548683363";

const Modal = ({ setShowModal, item, idCard }) => {
  const [formData, setFormData] = useState({
    message: "",
    keyword: "",
  });

  console.log(item);
  console.log(idCard);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const docContract = new ethers.Contract(
          docContractAddress,
          DocContractABI.abi,
          signer
        );

        const amount = ethers.utils.parseEther(item.amount.toString());
        const tx = await docContract.payForAccess(
          idCard,
          formData.message,
          formData.keyword,
          {
            value: amount,
          }
        );

        await tx.wait();

        console.log("Access granted!");

        const fileResponse = await fetch(
          `https://gateway.pinata.cloud/ipfs/${item.ipfsHASH}`
        );
        const fileBlob = await fileResponse.blob();
        const fileURL = URL.createObjectURL(fileBlob);

        const link = document.createElement("a");
        link.href = fileURL;
        link.download = item.header;
        link.click();

        console.log("File downloaded successfully");
      } else {
        console.log("MetaMask not detected");
      }
    } catch (error) {
      console.error("Error accessing document:", error);
    }
  };

  return (
    <div className="modal__wrapper">
      <div className="single__modal">
        <span className="close__modal">
          <i className="ri-close-line" onClick={() => setShowModal(false)}></i>
        </span>
        <h6 className="text-center text-light">Buy {item.header}</h6>
        <p className="text-center text-light">
          You must pay <span className="money">{item.amount} ETH</span>
        </p>
        <form onSubmit={handleSubmit}>
          <div className="input__item mb-4">
            <label>Message</label>
            <input
              type="text"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="will be logged with transaction"
              required
            />
          </div>

          <div className="input__item mb-3">
            <h6>Keyword</h6>
            <input
              type="text"
              name="keyword"
              value={formData.keyword}
              onChange={handleChange}
              placeholder="to generate memory gif"
              required
            />
          </div>

          <button type="submit" className="place__bid-btn">
            Purchase
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
