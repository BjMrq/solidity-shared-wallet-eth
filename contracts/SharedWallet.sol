// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "./Allowable.sol";

contract SharedWallet is Allowable {
    event Transaction(string, address, uint256);

    function transferTo(address _toAccount, uint256 _amountToTransfer)
        external
        payable
        onlyOwnerOrSelf(_toAccount)
        onlyWithEnoughAllowedBalance(_amountToTransfer)
    {
        payable(_toAccount).transfer(_amountToTransfer);

        reduceAllowance(_toAccount, _amountToTransfer);

        emit Transaction("sent", _toAccount, _amountToTransfer);
    }

    receive() external payable {
        emit Transaction("received", msg.sender, msg.value);
    }
}
