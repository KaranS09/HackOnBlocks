import React, { useState, useEffect } from "react";

import { ethers } from "ethers";

import DocContractABI from "./doc.json";

import CommonSection from "../components/ui/Common-section/CommonSection";

import NftCard from "../components/ui/Nft-card/Nftcard";

import { NFT__DATA } from "../assets/data/data";

import { Container, Row, Col } from "reactstrap";

import "../components/styles/market.css";

const docContractAddress = "0x32e4488Eb7B94c75aCcBF58C169a82B548683363";

const fetchDocuments = async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const docContract = new ethers.Contract(
        docContractAddress,
        DocContractABI.abi,
        signer
      );

      // Call the getAllDocuments function from your doc contract
      const documents = await docContract.getAllDocuments();

      // Structure the results in an array of objects
      const structuredDocuments = documents.map((doc) => ({
        user: doc.user,
        ipfsHASH: doc.ipfsHASH,
        amount: ethers.utils.formatEther(doc.amount),
        timestamp: new Date(doc.timestamp.toNumber() * 1000).toLocaleString(),
        des: doc.des,
        docType: doc.docType,
        header: doc.header,
      }));

      console.log(structuredDocuments);

      return structuredDocuments;
    } catch (error) {
      console.error(
        "Error connecting to contract or fetching documents:",
        error
      );
    }
  } else {
    console.log("MetaMask not detected");
  }
};

const Market = () => {
  const [documents, setDocuments] = useState([]);
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadDocuments = async () => {
      const docs = await fetchDocuments();
      setDocuments(docs);
    };

    loadDocuments();
  }, []);

  const handleCategory = () => {};

  const handleItems = () => {};

  // ====== SORTING DATA BY HIGH, MID, LOW RATE =========
  const handleSort = (e) => {
    const filterValue = e.target.value;

    if (filterValue === "high") {
      const filterData = NFT__DATA.filter((item) => item.currentBid >= 6);

      setData(filterData);
    }

    if (filterValue === "mid") {
      const filterData = NFT__DATA.filter(
        (item) => item.currentBid >= 5.5 && item.currentBid < 6
      );

      setData(filterData);
    }

    if (filterValue === "low") {
      const filterData = NFT__DATA.filter(
        (item) => item.currentBid >= 4.89 && item.currentBid < 5.5
      );

      setData(filterData);
    }
  };

  return (
    <>
      <CommonSection title={"MarketPlace"} />

      <section>
        <Container>
          <Row>
            <Col lg="12" className="mb-5">
              <div className="market__product__filter d-flex align-items-center justify-content-between">
                <div className="filter__left d-flex align-items-center gap-5">
                  <div className="all__category__filter">
                    <select onChange={handleCategory}>
                      <option>All Categories</option>
                      <option value="art">Art</option>
                      <option value="music">Music</option>
                      <option value="domain-name">Domain Name</option>
                      <option value="virtual-world">Virtual World</option>
                      <option value="trending-card">Trending Cards</option>
                    </select>
                  </div>

                  <div className="all__items__filter">
                    <select onChange={handleItems}>
                      <option>All Items</option>
                      <option value="single-item">Single Item</option>
                      <option value="bundle">Bundle</option>
                    </select>
                  </div>
                </div>

                <div className="filter__right">
                  <select onChange={handleSort}>
                    <option>Sort By</option>
                    <option value="high">High Rate</option>
                    <option value="mid">Mid Rate</option>
                    <option value="low">Low Rate</option>
                  </select>
                </div>
              </div>
            </Col>

            {documents?.map((item, index) => (
              <Col lg="3" md="4" sm="6" className="mb-4" key={index}>
                <NftCard item={item} idCard={index} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Market;
