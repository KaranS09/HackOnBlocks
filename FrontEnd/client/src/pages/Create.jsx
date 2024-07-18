import React from "react";
import { useState } from "react";
import { ethers } from "ethers";
import { Container, Row, Col } from "reactstrap";
import CommonSection from "../components/ui/Common-section/CommonSection";
import NftCard from "../components/ui/Nft-card/Nftcard";
import img from "../assets/images/img-01.png";
import avatar from "../assets/images/ava-01.png";
import DocContractABI from "./doc.json";

import "../components/styles/create-item.css";

const item = {
  id: "01",
  title: "Guard",
  desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veniam adipisci cupiditate officia, nostrum et deleniti vero corrupti facilis minima laborum nesciunt nulla error natus saepe illum quasi ratione suscipit tempore dolores. Recusandae, similique modi voluptates dolore repellat eum earum sint.",
  imgUrl: img,
  creator: "Trista Francis",
  creatorImg: avatar,
  currentBid: 7.89,
};

const Create = () => {
  const [formData, setFormData] = useState({
    ipfsHASH: "",
    amount: "",
    des: "",
    docType: "",
    header: "",
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const JWT =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhMWUyMGQxNC0zYzc1LTRkZDItOTI0Yi00NzVlMzczYWRiZTMiLCJlbWFpbCI6ImthcmFuLnNhdGhpc2g5ODBAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImQ0YzNhMWU0MWYwMjEyN2IwNThhIiwic2NvcGVkS2V5U2VjcmV0IjoiYTU1Y2NiZGI0YWMzYWUwOGZiOGZlMzRkMzYwZjNkZjA3MzZiYjg5YzE3ZDM3NWZjMzBiZGE1OTE1ZTQ2NmQ3MCIsImV4cCI6MTc1MTY1MTA3MH0.5LxBUUp3lPZerVfRtx-Gw3JzTpIDXyT7WMej7wRQ0MA";

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

    setIsUploading(true);
    setUploadSuccess(false);

    try {
      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${JWT}`,
          },
          body: uploadData,
        }
      );

      const resData = await res.json();
      setFormData((prevData) => ({
        ...prevData,
        ipfsHASH: resData.IpfsHash,
      }));
      setUploadSuccess(true);
      console.log("IPFS Hash:", resData.IpfsHash);
    } catch (error) {
      console.error("Error uploading file to IPFS:", error);
      setUploadSuccess(false);
    } finally {
      setIsUploading(false);
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
    <>
      <CommonSection title="Create Item" className="cr1" />

      <section>
        <Container>
          <Row>
            <Col lg="3" md="4" sm="6">
              <h5 className="mb-4 text-light">Preview Item</h5>
              <NftCard item={item} />
            </Col>

            <Col lg="9" md="8" sm="6">
              <div className="create__item">
                <form onSubmit={handleSubmit}>
                  <div className="form__input">
                    <label htmlFor="">Upload File</label>
                    <input
                      type="file"
                      className="upload__input"
                      onChange={handleFileUpload}
                      required
                    />
                    {isUploading && <p>Uploading file to IPFS...</p>}
                    {uploadSuccess && !isUploading && (
                      <p>File successfully uploaded to IPFS!</p>
                    )}
                  </div>

                  <div className="form__input">
                    <label htmlFor="">Price</label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="Enter price for one item (MATIC)"
                      required
                    />
                  </div>

                  <div className="form__input">
                    <label htmlFor="">Type of Document</label>
                    <input
                      type="text"
                      name="docType"
                      value={formData.docType}
                      onChange={handleChange}
                      placeholder=".pdf"
                      required
                    />
                  </div>

                  <div className="form__input">
                    <label htmlFor="">Title</label>
                    <input
                      type="text"
                      name="header"
                      value={formData.header}
                      onChange={handleChange}
                      placeholder="Enter title"
                      required
                    />
                  </div>

                  <div className="form__input">
                    <label htmlFor="">Description</label>
                    <textarea
                      name="des"
                      value={formData.des}
                      onChange={handleChange}
                      id=""
                      rows="7"
                      placeholder="Enter description"
                      className="w-100"
                      required
                    ></textarea>
                  </div>
                  <button type="submit">Submit</button>
                </form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Create;
