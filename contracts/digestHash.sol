// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

// This contract is meant to do the calculation and register job. The parameters are exactly the origin type
// For example, the userDid is string. In order to save the gas fee, we should modify and upgrade the contract,
// make these string type into byte32.

/**
 * @title digestHash
 * @dev calculate digestHash and help bound user's did with the digestHash
 */
contract digestHash {

    // represent the digestHash belongs to which ethereumAddress (digesthash => ethereumAddress)
    mapping(bytes32 => address) public ethereumOwner;

    // represent the ethereumAddress owns which didAddress (ethereumAddress => didAddress)
    mapping(address => string) public didOwner;


    /**
     * @dev calculate the digestHash
     * @param userDid, the did of the Verifiable Credential's owner
     * @param ctype, the ctype of the Verifiable Credential
     * @param expirationDate, the timestamp of the expirationDate.
     * @param roothash, the roothash of the Verifiable Credential
     */
    function calcDigestHash(
        string memory userDid,
        bytes32 ctype,
        bytes memory expirationDate,
        bytes32 roothash
    ) public pure returns (bytes32 digest) {
        bytes memory userDidAsBytes = bytes(userDid);

        bytes memory new64 = bytes.concat(roothash, userDidAsBytes);
        new64 = bytes.concat(new64, expirationDate);
        new64 = bytes.concat(new64, ctype);
        digest = keccak256(new64);
    }

    /**
     * @dev calculate the digestHash, and register it on chain
     * @param userDid, the did of the Verifiable Credential's owner
     * @param ctype, the ctype of the Verifiable Credential
     * @param expirationDate, the timestamp of the expirationDate.
     * @param roothash, the roothash of the Verifiable Credential
     */
    function registerDigestHash(
        string memory userDid,
        bytes32 ctype,
        bytes memory expirationDate,
        bytes32 roothash
    ) public {
        bytes32 digest = calcDigestHash(
            userDid,
            ctype,
            expirationDate,
            roothash
        );

        // make sure the VC hasn't been uploaded
        require(ethereumOwner[digest] == address(0),  "This VC has already been registered");

        if (bytes(didOwner[msg.sender]).length == 0) {
            didOwner[msg.sender] = userDid;
        } else {
            require(
                keccak256(abi.encodePacked(didOwner[msg.sender])) ==
                    keccak256(abi.encodePacked(userDid)),
                "You (this etheruemAddress) cannot upload others' VC, the didAddress is not you"
            );
        }

        ethereumOwner[digest] = msg.sender;
    }

    /**
     * @dev used to check the digest belongs to which ethereumAddress
     * @param digest, the digestHash of the VC
     */
    function checkEthereumOwner(
        bytes32 digest
    ) public view returns (address){
        return ethereumOwner[digest];
    }


    /**
     * @dev used to check the didAddress belongs to which ethereumAddress
     * @param ethereumAddress, the ethereumAddress to lookup
     */
    function checkDidOwner(
        address ethereumAddress
    ) public view returns (string memory){
        return didOwner[ethereumAddress];
    }
}
