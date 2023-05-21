// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "contracts/GainxInsurance.sol";
import "contracts/GainxFuture.sol";
import "contracts/GainxPool.sol";

// borrower sends the NFT to the escrow
// can withdraw the nft if offer is not accepted
// after offer accepted, lender sends the money to escrow
// if escrow has both nft and funds, send fund to borrower
// generate APY for lender
// if borrower sends funds in time, 
// send NFT to borrower
// the funds remain in the pool untill the lender gives the reedem tokens

/*
    1. Borrower should be able to list their NFT for borrowing tokens by selecting an APY (Futures)
    2. Lender should be able to accept any offer from explore and send the funds
    3. Lender should be able to buy an insurance if he wants to
    4. Dashboard - Lender, Borrower
            Lender - Show all lendings (borrower address, amount, APY, credit APY, tenure, insurance), credit score
            Borrower - Show all borrowings (lender address, amount, APY, tenure), credit score
        List NFT
        My NFTs
*/

contract GainxEscrow is GainxInsurance, GainxFuture, GainxPool {
    using Counters for Counters.Counter;

    Counters.Counter private _escrowIdCounter;

    uint256 redeemTenure = 24 * 60 * 2 * 7; // 1 week ---> 7 days in blocks @2/min

    struct Escrow {
        uint256 escrowId;
        uint256 startBlock;
        uint256 endBlock;
        address nftAddress;
        uint256 nftId;
        address lender;
        address borrower;
        uint256 amount;
        uint256 tenure;
        uint256 apy;
        bool isInsuared;
        bool accepted;
    }
    Escrow[] public escrows;

    struct LendingStates {
        bool receivedNft;
        bool receivedFunds;
        bool receivedRepayAmt;
        bool receivedReedemTokens;
        bool completed;
    }

    mapping(uint256 => Escrow) public idToEscrow;
    mapping(uint256 => LendingStates) public idToLendingStates;
    mapping(address => uint256) public lenderToRepayAmt;

    mapping(address => Escrow[]) public lendersList;
    mapping(address => Escrow[]) public borrowersList;

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
        return lendersList[_lender];
    }

    function getBorrowersList(address _borrower) public view returns(Escrow[] memory){  // working
        return borrowersList[_borrower];
    }
}
