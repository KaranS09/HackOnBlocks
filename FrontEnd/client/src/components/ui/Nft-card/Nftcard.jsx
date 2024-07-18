import React, { useState, useEffect } from "react";

import "./Nft-card.css";

import Modal from "../Modal/Modal";

const NftCard = ({ item, idCard }) => {
  const [url, setUrl] = useState("");
  const [isImage, setIsImage] = useState(false);
  const [showModal, setShowModal] = useState(false);
  console.log("ID Card: " + idCard);
  console.log(idCard);

  useEffect(() => {
    const fetchUrl = async () => {
      console.log(item);
      try {
        const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${item.ipfsHASH}`;
        setUrl(gatewayUrl);

        const response = await fetch(gatewayUrl, { method: "HEAD" });
        const contentType = response.headers.get("Content-Type");

        if (contentType && contentType.startsWith("image/")) {
          setIsImage(true);
        }
      } catch (error) {
        console.error("Error fetching the document URL:", error);
      }
    };

    fetchUrl();
  }, [item.ipfsHASH]);

  return (
    // <div className="document-card">
    //   {isImage ? (
    //     <div className="blurred-image-container">
    //       <img src={url} alt={props.item.des} className="blurred-image adjust-img" />
    //     </div>
    //   ) : (
    //     <div className="standard-image-container">
    //       <img src="/path/to/standard/image.jpg" alt="Standard" />
    //     </div>
    //   )}
    //   <div className="document-info">
    //     <p>User: {props.item.user}</p>
    //     <p>Amount: {props.item.amount} ETH</p>
    //     <p>Timestamp: {props.item.timestamp}</p>
    //     <p>Description: {props.item.des}</p>
    //     <p>Document Type: {props.item.docType}</p>
    //     <p>Header: {props.item.header}</p>
    //   </div>
    // </div>
    <div className="readjust-card single__nft__card">
      <div className="nft__img">
        {isImage ? (
          <div className="blurred-image-container">
            <img
              src={url}
              alt={item.des}
              className="blurred-image adjust-img"
            />
          </div>
        ) : (
          <div className="standard-image-container">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShSSUkC6IioN4WH4dS-cmT3h1uLm0j3-RMKQ&s"
              alt="Standard"
            />
          </div>
        )}
      </div>

      <div className="nft__content">
        <h5 className="nft__title">{item.header}</h5>
        <br />
        <h6>Created By</h6>

        <div className="creator__info-wrapper d-flex gap-3">
          {/* <div className="creator__img">
            <img src={creatorImg} alt="" className="w-100" />
          </div> */}

          <div className="creator__info w-100 d-flex align-items-center justify-content-between">
            <div>
              <p>{item.user ? item.user : <span>user</span>}</p>
            </div>
          </div>
        </div>

        <div>
          <h6>Cost To Access</h6>
          <p>{item.amount} ETH</p>
        </div>

        <span className="history__link">
          {item.des ? item.des : <span>Description of document</span>}
        </span>

        <div className=" mt-3 d-flex align-items-center justify-content-between">
          <button
            className="bid__btn d-flex align-items-center gap-1"
            onClick={() => setShowModal(true)}
          >
            <i class="ri-shopping-bag-line"></i> Purchase
          </button>

          {showModal && (
            <Modal setShowModal={setShowModal} item={item} idCard={idCard} />
          )}
        </div>
      </div>
    </div>
  );
};

export default NftCard;
