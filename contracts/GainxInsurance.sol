// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";

contract GainxInsurance {

    receive() payable external {}
    fallback() payable external {}
    
    using Counters for Counters.Counter;

    Counters.Counter private _insuranceIdCounter;

    struct Insurance {
        uint256 insuranceId;
        uint256 lendingId;
        address buyer;
        uint256 amount;
        bool claimed;
    }
    Insurance[] public insurances;

    mapping(uint256 => Insurance) public idToInsurance; // returns Insurance details by ID
    mapping(address => Insurance[]) public insurancesForAddress; // returns all insurances by an address
    mapping(uint256 => Insurance) public insuranceToDeal; // returns the insurance details by lendingId

    function buyInsurance(address _buyer, uint256 _amount, uint256 _lendingId) payable public {
        uint256 _insuranceId = _insuranceIdCounter.current();

        Insurance memory newInsurance = Insurance(_insuranceId, _lendingId, _buyer, _amount, false);

        insurances.push(newInsurance); // add to the insurance array
        idToInsurance[_insuranceId] = newInsurance; // insuranceId --> Insurance
        insurancesForAddress[_buyer].push(newInsurance); // add to a user's insured array
        insuranceToDeal[_lendingId] = newInsurance; // lendingId --> Insurance

        _insuranceIdCounter.increment();
    }

    function claimInsurance(uint256 _id) payable public {
        Insurance memory claimOffer = idToInsurance[_id];
        idToInsurance[_id].claimed = true;

        (bool sent, ) = claimOffer.buyer.call{value: claimOffer.amount}("");
        require(sent, "Failed to send Ether");
    }

    function getInsuranceDetailsById(uint256 _id) public view returns(Insurance memory) {
        return idToInsurance[_id];
    }

    function getAllInsurancesByAddress(address _user) public view returns(Insurance[] memory) {
        return insurancesForAddress[_user];
    }

    function getInsuranceDetailsByLendingId(uint256 _id) public view returns(Insurance memory) {
        return insuranceToDeal[_id];
    }

    function getTotalInsurances() public view returns(uint256) {
        return insurances.length;
    }
}