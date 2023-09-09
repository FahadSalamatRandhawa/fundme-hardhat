// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PriceConverter.sol";

error FundMe__UnAuthorized();
error FundMe__Unexpected();

/**
 * @title A crowd funding contract, accepts ether
 * @author Fahad Salamat Randhawa
 * @notice This is a sample for web3 portfolio
 * @dev This uses price feed from chainlink to get token/ether value
 */

contract FundMe {
    using PriceConverter for uint;

    address public immutable i_owner; //assign-able once
    uint public constant MINIMUM_USD = 5 * 1e18; //gas efficient
    address[] public funders;
    mapping(address => uint) public AmountToAddress;

    AggregatorV3Interface public immutable priceFeed;

    constructor(address _priceFeedAddress) {
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(_priceFeedAddress);
    }

    modifier verifyOwner() {
        if (msg.sender != i_owner) {
            revert FundMe__UnAuthorized();
        }

        //execute rest of code if require validates
        _;
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    function withdraw() external verifyOwner {
        address[] memory m_funders = funders;
        for (
            uint fundersIndex = 0;
            fundersIndex < m_funders.length;
            fundersIndex++
        ) {
            AmountToAddress[m_funders[fundersIndex]] = 0;
        }
        //refresh funders list
        funders = new address[](0);

        //transfer all balance from this contract to msg.sender, no gas limit
        (bool success, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        if (!success) {
            revert FundMe__Unexpected();
        }
    }

    function fund() public payable {
        //convert Ether to USD
        require(
            msg.value.conversion(priceFeed) >= MINIMUM_USD,
            "Send minimum $5"
        );

        //keep record of funders
        funders.push(msg.sender);
        AmountToAddress[msg.sender] += msg.value;
    }
}
