pragma solidity ^0.4.17;

import "./BuildingBase.sol";
import "./ERC721.sol";

contract BuildingOwnership is BuildingBase, ERC721 {

    using SafeMath for uint256;

    mapping (uint => address) buildingApprovals;

    function balanceOf(address _owner) public view returns (uint256 _balance) {
        return ownerBuildingCount[_owner];
    }

    function ownerOf(uint256 _tokenId) public view returns (address _owner) {
        return buildingToOwner[_tokenId];
    }

    function _transfer(address _from, address _to, uint256 _tokenId) private {
        ownerBuildingCount[_to] = ownerBuildingCount[_to].add(1);
        ownerBuildingCount[msg.sender] = ownerBuildingCount[msg.sender].sub(1);
        buildingToOwner[_tokenId] = _to;
        Transfer(_from, _to, _tokenId);
    }

    function transfer(address _to, uint256 _tokenId) public onlyOwnerOf(_tokenId) {
        _transfer(msg.sender, _to, _tokenId);
    }

    function approve(address _to, uint256 _tokenId) public onlyOwnerOf(_tokenId) {
        buildingApprovals[_tokenId] = _to;
        Approval(msg.sender, _to, _tokenId);
    }

    function takeOwnership(uint256 _tokenId) public {
        require(buildingApprovals[_tokenId] == msg.sender);
        address owner = ownerOf(_tokenId);
        _transfer(owner, msg.sender, _tokenId);
    }
}
