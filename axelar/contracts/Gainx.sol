// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "contracts/GainxInsurance.sol";
import "contracts/GainxFuture.sol";
import "contracts/GainxEscrow.sol";

import "@openzeppelin/contracts/utils/Counters.sol";


/*
************************** Insurance **************************
    struct Insurance {
        uint256 id;
        uint256 lendingId;
        address buyer;
        uint256 amount;
        bool claimed;
    }
    Insurance[] public insurances;

    mapping(uint256 => Insurance) public idToInsurance; // returns Insurance details by ID
    mapping(address => Insurance[]) public insurancesForAddress; // returns all insurances by an address
    mapping(uint256 => Insurance) public insuranceToDeal; // returns the insurance details of an NFT lending

************************** Future **************************  
    mapping(address => uint256) public escrowToApy;
    mapping(uint256 => uint256) public offerIdToApy; 
*/

/*
    (borrower address, amount, APY, credit APY, tenure, insurance), credit score
    function that returns explore page lending offers (lendingId, owner, amount, APY, tenure, insuranceId)
    function that returns offers I lended money
    function that returns offers I borrowed
*/

contract Gainx is GainxInsurance, GainxFuture, GainxEscrow {
    using Counters for Counters.Counter;

    Counters.Counter private _lendingIdCounter;

    struct LendingOffer {
        uint256 lendingId;
        address lender;
        address borrower;
        uint256 amount;
        uint256 startBlock;
        uint256 endBlock; // 80,640 blocks in 28 days
        uint256 tenure;
        uint256 apy;
        uint256 returnAmount;
        uint256 excrowId;
        bool isInsuared;
    }

    LendingOffer[] public lendingOffers; 

    mapping(uint256 => LendingOffer) public lendingOfferById;

    function registerOffer(address _lender, address _borrower, uint256 _amount, uint256 _tenure, uint256 _apy, uint256 _returnAmount, uint256 _escrowId, bool _isInsuared) public {
        uint256 _lendingId = _lendingIdCounter.current();
        uint256 _startBlock = block.number;
        uint256 _endBlock = block.number + _tenure;

        LendingOffer memory newLendingOffer = LendingOffer(_lendingId, _lender, _borrower, _amount, _startBlock, _endBlock, _tenure, _apy, _returnAmount, _escrowId, _isInsuared);

        lendingOffers.push(newLendingOffer);
        lendingOfferById[_lendingId] = newLendingOffer;

        _lendingIdCounter.increment();
    }

    function getLendingOfferbyId(uint256 _offerId) view public returns(LendingOffer memory) {
        return lendingOfferById[_offerId];
    }
}