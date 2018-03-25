pragma solidity ^0.4.17;

import "./ownable.sol";
import "./safemath.sol";

contract BuildingBase is Ownable {

    using SafeMath for uint256;

    event NewBuilding(uint buildingId, string name, string buildingLocationAddress);

    struct Building {
        string name;
        string buildingLocationAddress;
    }

    Building[] public buildings;

    mapping (uint => address) public buildingToOwner;
    mapping (address => uint) ownerBuildingCount;

    modifier onlyOwnerOf(uint _buildingId) {
        require(msg.sender == buildingToOwner[_buildingId]);
        _;
    }

    function listBuilding(string _name, string _buildingLocationAddress) public onlyOwner {
        uint id = buildings.push(Building(_name, _buildingLocationAddress)) - 1;
        buildingToOwner[id] = msg.sender;
        ownerBuildingCount[msg.sender] = ownerBuildingCount[msg.sender].add(1);
        NewBuilding(id, _name, _buildingLocationAddress);
    }

    function getBuildingsByOwner(address _owner) external view returns(uint[]) {
        uint[] memory result = new uint[](ownerBuildingCount[_owner]);
        uint counter = 0;
        for (uint i = 0; i < buildings.length; i++) {
            if (buildingToOwner[i] == _owner) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }

    function withdraw() external onlyOwner {
        owner.transfer(this.balance);
    }
}
