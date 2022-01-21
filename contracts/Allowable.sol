// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "./Accountable.sol";

contract Allowable is Accountable {
    using SafeMath for uint256;

    event AllowanceChanged(address, uint256, uint256);

    modifier onlyWithEnoughAllowedBalance(uint256 _requestedAmount) {
        require(
            accountBook.isRegistered[_msgSender()] &&
                accountBook.allowedAccountBalance[_msgSender()] >=
                _requestedAmount,
            "Only an account with enough allowed balance can perform this action"
        );
        _;
    }

    function increaseAllowanceFor(
        address _accountToAllow,
        uint256 _amountToAllow
    ) private {
        uint256 newAllowance = accountBook
            .allowedAccountBalance[_accountToAllow]
            .add(_amountToAllow);

        uint256 previousAllowance = accountBook.allowedAccountBalance[
            _accountToAllow
        ];

        accountBook.totalAmountAllowed = accountBook.totalAmountAllowed.add(
            _amountToAllow
        );
        accountBook.allowedAccountBalance[_accountToAllow] = newAllowance;

        emit AllowanceChanged(_accountToAllow, previousAllowance, newAllowance);
    }

    function reduceAllowance(
        address _accountToDisallow,
        uint256 _amountToDisallow
    ) internal {
        uint256 newAllowance = accountBook
            .allowedAccountBalance[_accountToDisallow]
            .sub(_amountToDisallow);

        uint256 previousAllowance = accountBook.allowedAccountBalance[
            _accountToDisallow
        ];

        accountBook.totalAmountAllowed = accountBook.totalAmountAllowed.sub(
            _amountToDisallow
        );
        accountBook.allowedAccountBalance[_accountToDisallow] = newAllowance;

        emit AllowanceChanged(
            _accountToDisallow,
            previousAllowance,
            newAllowance
        );
    }

    function addAllowanceTo(
        address _accountToAllow,
        uint256 _amountToAllow_accountToAllow
    ) public onlyOwner {
        require(
            (
                accountBook.totalAmountAllowed.add(
                    _amountToAllow_accountToAllow
                )
            ) >= getContractBalance()
        );

        increaseAllowanceFor(_accountToAllow, _amountToAllow_accountToAllow);
    }

    function getAddressAllowedBalance(address _accountAddress)
        external
        view
        returns (uint256)
    {
        return accountBook.allowedAccountBalance[_accountAddress];
    }
}
