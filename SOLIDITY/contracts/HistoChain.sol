// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title HistoChain
 * @dev Sistema de historiales médicos en NFTs
 */
contract HistoChain is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;

    struct Record {
        string ipfsHash;          // Hash del archivo cifrado en IPFS
        address patient;          // Dueño del historial
        address authorizedDoctor; // Médico autorizado
        uint256 date;             // Fecha de creación
    }

    mapping(uint256 => Record) public records;

    event RecordCreated(uint256 tokenId, address patient, string ipfsHash);
    event DoctorAuthorized(uint256 tokenId, address doctor);

    constructor() ERC721("HistoChain", "HISTO") Ownable(msg.sender) {}

    /**
     * @dev Crear un nuevo historial médico NFT
     * @param ipfsHash Hash del archivo (en IPFS) cifrado
     */
    function createRecord(string memory ipfsHash) public returns (uint256) {
        _tokenIds++;
        uint256 newId = _tokenIds;

        _safeMint(msg.sender, newId);
        _setTokenURI(newId, ipfsHash); // opcional: guardar IPFS como URI

        records[newId] = Record({
            ipfsHash: ipfsHash,
            patient: msg.sender,
            authorizedDoctor: address(0),
            date: block.timestamp
        });

        emit RecordCreated(newId, msg.sender, ipfsHash);
        return newId;
    }

    /**
     * @dev Autorizar a un médico a acceder al historial
     */
    function authorizeDoctor(uint256 tokenId, address doctor) public {
        require(ownerOf(tokenId) == msg.sender, "Solo el paciente puede autorizar");
        records[tokenId].authorizedDoctor = doctor;
        emit DoctorAuthorized(tokenId, doctor);
    }

    /**
     * @dev Obtener información del historial
     */
    function getRecord(uint256 tokenId) public view returns (Record memory) {
        require(
            msg.sender == records[tokenId].patient || 
            msg.sender == records[tokenId].authorizedDoctor,
            "No autorizado"
        );
        return records[tokenId];
    }
}
