// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "./transact.sol";

contract doc {
    uint256 public docCount;
    Transactions public transactionsContract;

    event Upload(address indexed from, string ipfsHASH, uint amount, uint256 timestamp, string des, string docType, string header);
    event AccessGranted(address indexed user, uint256 indexed docId);

    struct docStruct {
        address user;
        string ipfsHASH;
        uint amount;
        uint256 timestamp;
        string des;
        string docType;
        string header;
    }

    docStruct[] public documents;

    mapping(uint256 => mapping(address => bool)) public accessGranted;

    constructor(address _transactionsContractAddress) {
        transactionsContract = Transactions(_transactionsContractAddress);
    }

    function addToBlockchain(string memory ipfsHASH, uint amount, string memory des, string memory docType, string memory header) public returns (uint256) {
        docCount += 1;
        documents.push(docStruct(msg.sender, ipfsHASH, amount, block.timestamp, des, docType, header));

        emit Upload(msg.sender, ipfsHASH, amount, block.timestamp, des, docType, header);

        return documents.length - 1;
    }

    function payForAccess(uint256 docId, string memory message, string memory keyword) public payable {
        require(docId < docCount, "Document does not exist");
        require(msg.value == documents[docId].amount, "Incorrect amount sent");
        require(!accessGranted[docId][msg.sender], "Access already granted");

        transactionsContract.addToBlockchain(payable(documents[docId].user), msg.value, message, keyword);

        accessGranted[docId][msg.sender] = true;

        emit AccessGranted(msg.sender, docId);
    }

    function getDocument(uint256 docId) public view returns (string memory ipfsHASH, uint amount, uint256 timestamp, string memory des, string memory docType, string memory header) {
        require(docId < docCount, "Document does not exist");
        require(accessGranted[docId][msg.sender], "Access not granted");

        docStruct storage document = documents[docId];
        return (document.ipfsHASH, document.amount, document.timestamp, document.des, document.docType, document.header);
    }

    function getDocumentCount() public view returns (uint256) {
        return docCount;
    }

    function getAllDocuments() public view returns (docStruct[] memory){
        return documents;
    }
}
