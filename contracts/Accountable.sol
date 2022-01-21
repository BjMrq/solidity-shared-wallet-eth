// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./Restrictable.sol";

contract Accountable is Restrictable {
    event AddressInfo(string, address);

    struct AccountBook {
        uint256 totalAmountAllowed;
        address[] addresses;
        mapping(address => bool) isRegistered;
        mapping(address => uint256) allowedAccountBalance;
    }

    AccountBook accountBook;

    modifier onlyRegisteredAddress() {
        require(
            accountBook.isRegistered[_msgSender()],
            "You do not have a registered account"
        );
        _;
    }

    function getContractBalance() public view onlyOwner returns (uint256) {
        return address(this).balance;
    }

    function addAddressToAccountBookWith(address _accountAddress) private {
        accountBook.isRegistered[_accountAddress] = true;
        accountBook.addresses.push(_accountAddress);
        accountBook.allowedAccountBalance[_accountAddress] = 0;
    }

    function registerAccountFor(address _accountAddress) external onlyOwner {
        require(
            !accountBook.isRegistered[_accountAddress],
            "Account already registered"
        );

        addAddressToAccountBookWith(_accountAddress);

        emit AddressInfo("registered", _accountAddress);
    }

    function getRegisteredAccounts()
        external
        view
        onlyOwner
        returns (address[] memory)
    {
        return accountBook.addresses;
    }
}
