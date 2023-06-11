// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "contracts/GainxInsurance.sol";
import "contracts/GainxFuture.sol";
import "contracts/GainxPool.sol";

contract GainxEscrow is
    GainxInsurance,
    GainxFuture,
    GainxPool,
    AutomationCompatibleInterface
{
    AggregatorV3Interface internal dataFeed1;
    AggregatorV3Interface internal dataFeed2;
    AggregatorV3Interface internal dataFeed3;
    AggregatorV3Interface internal dataFeed4;
    using Counters for Counters.Counter;

    // uint public immutable interval; every 1 month
    uint public lastTimeStamp;

    address immutable tnt20TokenAddress;

    constructor(address _tnt20TokenAddr) {
        tnt20TokenAddress = _tnt20TokenAddr;
        dataFeed1 = AggregatorV3Interface(
            0x0715A7794a1dc8e42615F059dD6e406A6594651A
        );
        dataFeed2 = AggregatorV3Interface(
            0x12162c3E810393dEC01362aBf156D7ecf6159528
        );
        dataFeed3 = AggregatorV3Interface(
            0x1C2252aeeD50e0c9B64bDfF2735Ee3C932F5C408
        );
        dataFeed4 = AggregatorV3Interface(
            0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada
        );

        lastTimeStamp = block.timestamp;
    }

    Counters.Counter private _escrowIdCounter;
    uint count;

    uint256 redeemTenure = 24 * 60 * 2 * 7; // 1 week ---> 7 days in blocks @2/min

    function getETHtoUSD() public view returns (int) {
        // prettier-ignore
        // divide by 10^3
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = dataFeed1.latestRoundData();
        return answer;
    }

    function getLINKtoMATIC() public view returns (int) {
        // prettier-ignore
        // divide by 10^3
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = dataFeed2.latestRoundData();
        return answer;
    }

    function getLINKtoUSD() public view returns (int) {
        // prettier-ignore
        // divide by 10^18
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = dataFeed3.latestRoundData();
        return answer;
    }

    function getMATICtoUSD() public view returns (int) {
        // prettier-ignore
        // divide by 10^3
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = dataFeed4.latestRoundData();
        return answer;
    }

    function _initEscrow(
        address _borrower,
        uint256 _amount,
        address _nftAddress,
        uint256 _nftId,
        uint256 _tenure,
        uint256 _apy
    ) public payable {
        // working
        uint256 _escrowId = _escrowIdCounter.current();

        uint256 _startBlock = block.number;
        uint256 _endBlock = _startBlock + (_tenure * 2880);

        _lockFutureApy(_escrowId, _apy); // Future for APY

        Escrow memory newEscrow = Escrow(
            _escrowId,
            _startBlock,
            _nftAddress,
            _nftId,
            address(0),
            _borrower,
            _amount,
            _tenure,
            _apy,
            false,
            false,
            false
        );
        escrows.push(newEscrow);
        idToEscrow[_escrowId] = newEscrow;

        borrowersList[_borrower].push(newEscrow);

        LendingStates memory newLendingState = LendingStates(
            true,
            false,
            false,
            false,
            false
        );

        idToLendingStates[_escrowId] = newLendingState;

        _escrowIdCounter.increment();
    }

    function _withdrawNft(uint256 _escrowId) public payable {
        require(
            idToLendingStates[_escrowId].receivedFunds == false,
            "Cannot withdraw NFT now!!"
        );

        // send the NFT back to borrower
    }

    function _acceptOffer(uint256 _escrowId, bool _isInsuared) public payable {
        // working
        Escrow storage currEscrow = idToEscrow[_escrowId];

        if (_isInsuared) {
            buyInsurance(msg.sender, currEscrow.amount, _escrowId);
            currEscrow.isInsuared = true;
        }

        idToLendingStates[_escrowId].receivedFunds = true;
        currEscrow.accepted = true;
        currEscrow.lender = msg.sender;

        uint256 _repayAmt = currEscrow.amount +
            ((currEscrow.apy * currEscrow.amount) / 100); // amount --> 10^18 format
        lenderToRepayAmt[msg.sender] = _repayAmt;
        lendersList[msg.sender].push(currEscrow);

        (bool sent, ) = currEscrow.borrower.call{value: currEscrow.amount}("");
        require(sent, "Failed to send Ether");

        IERC20(tnt20TokenAddress).transfer(
            msg.sender,
            idToEscrow[_escrowId].amount
        );
    }

    function _receiveRepayAmt(uint256 _escrowId) public payable {
        idToLendingStates[_escrowId].receivedRepayAmt = true;
        idToLendingStates[_escrowId].completed = true;
        idToEscrow[_escrowId].completed = true;

        // send the NFT back to borrower
    }

    function _receiveReedemAmt(uint256 _escrowId) public payable {
        // working
        idToLendingStates[_escrowId].receivedReedemTokens = true;

        (bool sent, ) = idToEscrow[_escrowId].lender.call{
            value: lenderToRepayAmt[idToEscrow[_escrowId].lender]
        }("");
        require(sent, "Failed to send TFil tokens");

        // send the TFil to the lender
    }

    function getExploreListings() public view returns (Escrow[] memory) {
        // working
        uint totalItemCount = escrows.length;
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToEscrow[i].accepted == false) {
                itemCount += 1;
            }
        }

        Escrow[] memory items = new Escrow[](itemCount);

        for (uint i = 0; i < totalItemCount; i++) {
            if (idToEscrow[i].accepted == false) {
                uint currentId = i;

                Escrow storage currentItem = idToEscrow[currentId];

                items[currentIndex] = currentItem;

                currentIndex += 1;
            }
        }

        return items;
    }

    /*
    mapping(address => Escrow[]) public lendersList;
    mapping(address => Escrow[]) public borrowersList;
    */

    function getLendersList(
        address _lender
    ) public view returns (Escrow[] memory) {
        // working
        uint totalItemCount = lendersList[_lender].length;
        uint currentIndex = 0;

        Escrow[] memory items = new Escrow[](totalItemCount);

        for (uint i = 0; i < totalItemCount; i++) {
            uint256 tempId = lendersList[_lender][i].escrowId;

            Escrow storage currentItem = idToEscrow[tempId];

            items[currentIndex] = currentItem;

            currentIndex += 1;
        }

        return items;
    }

    function getBorrowersList(
        address _borrower
    ) public view returns (Escrow[] memory) {
        // working
        uint totalItemCount = borrowersList[_borrower].length;
        uint currentIndex = 0;

        Escrow[] memory items = new Escrow[](totalItemCount);

        for (uint i = 0; i < totalItemCount; i++) {
            uint currentId = borrowersList[_borrower][i].escrowId;

            Escrow storage currentItem = idToEscrow[currentId];

            items[currentIndex] = currentItem;

            currentIndex += 1;
        }

        return items;
    }

    function checkUpkeep(
        bytes calldata checkData
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        uint256 escrowId = abi.decode(checkData, (uint256));

        upkeepNeeded =
            (idToEscrow[escrowId].startBlock + idToEscrow[escrowId].tenure) >
            block.number;
        // We don't use the checkData in this example. The checkData is defined when the Upkeep was registered.
        bytes memory encodedData = abi.encode(escrowId);

        return (upkeepNeeded, encodedData);
    }

    function performUpkeep(bytes calldata performData) external override {
        // We highly recommend revalidating the upkeep in the performUpkeep function
        uint256 escrowId = abi.decode(performData, (uint256));

        if (
            (idToEscrow[escrowId].startBlock + idToEscrow[escrowId].tenure) >
            block.number
        ) {
            _receiveReedemAmt(escrowId);
        }

        // We don't use the performData in this example.
        // The performData is generated by the Automation Node's call to your checkUpkeep function
    }

    function getCount() external view returns (uint) {
        return count;
    }
}
