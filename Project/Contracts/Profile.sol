pragma solidity ^0.8.0;

contract UserStorage {
    mapping(address => string) public userHashes;

    function storeUserHash(string memory ipfsHash) public {
        userHashes[msg.sender] = ipfsHash;
    }

    function getUserHash(address user) public view returns (string memory) {
        return userHashes[user];
    }
}
