// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Restrictable is Ownable {
    modifier onlyOwnerOrSelf(address _targetAccount) {
        require(
            isOwner() || _targetAccount == _msgSender(),
            "Only owner or targeted account can perform this action"
        );
        _;
    }

    function isOwner() private view returns (bool) {
        return owner() == _msgSender();
    }

    function renounceOwnership() public view override(Ownable) onlyOwner {
        revert("Ownership can not be renounced, deal with it");
    }
}
