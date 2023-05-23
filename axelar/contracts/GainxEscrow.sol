// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "contracts/GainxInsurance.sol";
import "contracts/GainxFuture.sol";
import "contracts/GainxPool.sol";

import { AxelarExecutable } from "@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol";
import { IAxelarGateway } from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
import { IAxelarGasService } from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";

contract GainxEscrow is GainxInsurance, GainxFuture, GainxPool, AxelarExecutable {
    string public value;
    string public sourceChain;
    string public sourceAddress;
    IAxelarGasService public immutable gasService;

    constructor(address gateway_, address gasReceiver_) AxelarExecutable(gateway_) {
        gasService = IAxelarGasService(gasReceiver_);
    }

    // Call this function to update the value of this contract along with all its siblings'.
    function sendMessage(
        string calldata destinationChain,
        string calldata destinationAddress,
        string calldata value_
    ) external payable {
        bytes memory payload = abi.encode(value_);
        if (msg.value > 0) {
            gasService.payNativeGasForContractCall{ value: msg.value }(
                address(this),
                destinationChain,
                destinationAddress,
                payload,
                msg.sender
            );
        }
        gateway.callContract(destinationChain, destinationAddress, payload);
    }

    // Handles calls created by setAndSend. Updates this contract's value
    function _execute(
        string calldata sourceChain_,
        string calldata sourceAddress_,
        bytes calldata payload_
    ) internal override {
        (value) = abi.decode(payload_, (string));
        sourceChain = sourceChain_;
        sourceAddress = sourceAddress_;
    }

    using Counters for Counters.Counter;

    Counters.Counter private _escrowIdCounter;

    uint256 redeemTenure = 24 * 60 * 2 * 7; // 1 week ---> 7 days in blocks @2/min

    function _initEscrow(address _borrower, uint256 _amount, address _nftAddress, uint256 _nftId, uint256 _tenure, uint256 _apy) payable public {  // working
        uint256 _escrowId = _escrowIdCounter.current();

        uint256 _startBlock = block.number;
        uint256 _endBlock = _startBlock + (_tenure * 2880);
        
        _lockFutureApy(_escrowId, _apy); // Future for APY
        
        Escrow memory newEscrow = Escrow(_escrowId, _startBlock, _endBlock, _nftAddress, _nftId, address(0), _borrower, _amount, _tenure, _apy, false, false);
        escrows.push(newEscrow);
        idToEscrow[_escrowId] = newEscrow;

        borrowersList[_borrower].push(newEscrow);

        LendingStates memory newLendingState = LendingStates(true, false, false, false, false);

        idToLendingStates[_escrowId] = newLendingState;

        _escrowIdCounter.increment();
    }

    function _withdrawNft(uint256 _escrowId) payable public {
        require(idToLendingStates[_escrowId].receivedFunds == false, "Cannot withdraw NFT now!!");

        // send the NFT back to borrower
    }

    function _acceptOffer(uint256 _escrowId, bool _isInsuared) payable public { // working
        Escrow storage currEscrow = idToEscrow[_escrowId];

        if (_isInsuared) {
            buyInsurance(msg.sender, currEscrow.amount, _escrowId);
            currEscrow.isInsuared = true;
        }

        idToLendingStates[_escrowId].receivedFunds = true;
        currEscrow.accepted = true;
        currEscrow.lender = msg.sender;

        uint256 _repayAmt = currEscrow.amount + ((currEscrow.apy * currEscrow.amount) / 100);  // amount --> 10^18 format 
        lenderToRepayAmt[msg.sender] = _repayAmt;
        lendersList[msg.sender].push(currEscrow);

        (bool sent,) = currEscrow.borrower.call{value: currEscrow.amount}("");
        require(sent, "Failed to send Ether");
    }

    function _receiveRepayAmt(uint256 _escrowId) payable public {
        idToLendingStates[_escrowId].receivedRepayAmt = true;
        idToLendingStates[_escrowId].completed = true;

        // send the NFT back to borrower
    }

    function _receiveReedemAmt(uint256 _escrowId) payable public {  // working
        idToLendingStates[_escrowId].receivedReedemTokens = true;

        (bool sent, ) = idToEscrow[_escrowId].lender.call{value: lenderToRepayAmt[idToEscrow[_escrowId].lender]}("");
        require(sent, "Failed to send TFil tokens");

        // send the TFil to the lender
    }

    function getExploreListings() public view returns(Escrow[] memory) {  // working
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

    function getLendersList(address _lender) public view returns(Escrow[] memory){  // working
        uint totalItemCount = lendersList[_lender].length;
        // uint itemCount = 0;
        uint currentIndex = 0;

        Escrow[] memory items = new Escrow[](totalItemCount);

        for (uint i = 0; i < totalItemCount; i++) {
                uint currentId = i;

                Escrow storage currentItem = idToEscrow[currentId];

                items[currentIndex] = currentItem;

                currentIndex += 1;
        }

        return items;
    }

    function getBorrowersList(address _borrower) public view returns(Escrow[] memory){  // working
        uint totalItemCount = borrowersList[_borrower].length;
        // uint itemCount = 0;
        uint currentIndex = 0;

        Escrow[] memory items = new Escrow[](totalItemCount);

        for (uint i = 0; i < totalItemCount; i++) {
                uint currentId = i;

                Escrow storage currentItem = idToEscrow[currentId];

                items[currentIndex] = currentItem;

                currentIndex += 1;
        }

        return items;
    }
}
