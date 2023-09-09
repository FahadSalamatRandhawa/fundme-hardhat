// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function conversion(
        uint _amount,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint) {
        (, int answer, , , ) = priceFeed.latestRoundData();
        return ((uint(answer * 1e10) * _amount) / 1e18);
    }

    function conversionRate(
        AggregatorV3Interface priceFeed
    ) public view returns (uint) {
        (, int answer, , , ) = priceFeed.latestRoundData();
        return uint(answer * 1e10);
    }
}
