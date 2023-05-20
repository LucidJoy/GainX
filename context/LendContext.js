import React, { createContext, useState, useEffect } from "react";
import { ethers, utils } from "ethers";
import Web3Modal from "web3modal";
const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");

import gainx from "./Gainx.json";
import gainxToken from "./GainxToken.json";
import redeemToken from "./RedeemToken.json";

import { useRouter } from "next/router";

const CreateLendContext = createContext({});

const gainxContractAddress = "0x513028401543099405cb47bC00788a05d99E91F2";
const gainxTokenContractAddress = "0xd4e6eC0202F1960dA896De13089FF0e4A07Db4E9";
const redeemTokenContractAddress = "0xEC6C1001a15c48D4Ea2C7CD7C45a1c5b6aD120E9";

const gainxAbi = gainx.abi;
const gainxTokenAbi = gainxToken.abi;
const redeemTokenAbi = redeemToken.abi;

export const CreateLendProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [allListings, setAllListings] = useState([]);
  const [myNfts, setMyNfts] = useState([]);
  const [lenderList, setLenderList] = useState([]);
  const [borrowerList, setBorrowerList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getAllListings = async () => {
    let results = [];
    let element;
    try {
      if (window.ethereum) {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const contract = new ethers.Contract(
          gainxContractAddress,
          gainxAbi,
          provider
        );

        if (ethereum.isConnected()) {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          console.log(accounts[0]);
        }

        const txRes = await contract.getExploreListings();

        txRes.map((escrow, i) => {
          element = {
            escrowId: Number(escrow.escrowId._hex),
            nftAddress: escrow.nftAddress,
            nftId: Number(escrow.nftId._hex),
            lender: escrow.lender,
            borrower: escrow.borrower,
            amount: utils.formatEther(Number(escrow.amount._hex).toString()),
            tenure: Number(escrow.tenure._hex),
            apy: Number(escrow.apy._hex),
            isInsuared: escrow.isInsuared,
            accepted: escrow.accepted,
          };

          results.push(element);
        });

        setAllListings(results);

        console.log("All Listings👽: ", txRes);
        return true;
      }
    } catch (error) {
      alert("Fetch listing Err: ", error);
      console.log("Fetch listing Err: ", error);
    }
  };

  useEffect(() => {
    (async () => {
      await getAllListings();
    })();
  }, []);

  useEffect(() => {
    console.log("State listings: ", allListings);
    console.log("My NFTs list: ", myNfts);
    console.log("Lenders' list: ", lenderList);
    console.log("Borrowers' list: ", borrowerList);
  });

  const getMyNfts = async () => {
    let address;

    if (ethereum.isConnected()) {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      console.log(accounts[0]);
      // address = "0x9aCEcAF7e11BCbb9c114724FF8F51930e24f164b";
      address = accounts[0];
    }

    try {
      await Moralis.start({
        apiKey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImY5NTRhNjgxLTAwNDUtNDNkMy1iYjkxLWYxYTBiOGEwMWM5YyIsIm9yZ0lkIjoiMjI4NTY4IiwidXNlcklkIjoiMjI5MTg1IiwidHlwZUlkIjoiMTUzYmFjNjYtYmFlMS00YzhlLWFiMDAtNmM3YmJmMjA3OGYzIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2ODMxMjQ0NTEsImV4cCI6NDgzODg4NDQ1MX0.bMwmShjXh4mKFoA8OgfOz8m2mV5wf6Ti1LnKkiKC8HI",
        // ...and any other configuration
      });
    } catch (error) {
      console.log("Moralis server re-initialzed");
    }

    const allNFTs = [];

    const chains = [
      EvmChain.MUMBAI,
      EvmChain.POLYGON,
    ];

    let i = 0;

    for (const chain of chains) {
      const response = await Moralis.EvmApi.nft.getWalletNFTs({
        address,
        chain,
      });

      allNFTs.push(...response.jsonResponse.result);
      i++;
    }

    setMyNfts(allNFTs);

    console.log("My NFTs💵: ", allNFTs);
  };

  useEffect(() => {
    (async () => {
      await getMyNfts();
    })();
  }, []);

  const getLendedOffers = async () => {
    let results = [];
    let element;
    let userAddress;
    try {
      if (window.ethereum) {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const contract = new ethers.Contract(
          gainxContractAddress,
          gainxAbi,
          provider
        );

        if (ethereum.isConnected()) {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          console.log(accounts[0]);
          userAddress = accounts[0];
        }

        const txRes = await contract.getLendersList(userAddress);

        txRes.map((offer, i) => {
          element = {
            escrowId: Number(offer.escrowId._hex),
            nftAddress: offer.nftAddress,
            nftId: Number(offer.nftId._hex),
            lender: offer.lender,
            borrower: offer.borrower,
            amount: utils.formatEther(Number(offer.amount._hex).toString()),
            tenure: Number(offer.tenure._hex),
            apy: Number(offer.apy._hex),
            isInsuared: offer.isInsuared,
            accepted: offer.accepted,
          };

          results.push(element);
        });

        setLenderList(results);

        console.log("Lenders List📞: ", results);
        return true;
      }
    } catch (error) {
      alert("Fetch listing Err: ", error);
      console.log("Fetch listing Err: ", error);
    }
  };

  useEffect(() => {
    (
      async () => {
        await getLendedOffers();
      }
    )();
  }, []);

  const getBorrowOffers = async () => {
    let results = [];
    let element;
    let userAddress;
    try {
      if (window.ethereum) {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const contract = new ethers.Contract(
          gainxContractAddress,
          gainxAbi,
          provider
        );

        if (ethereum.isConnected()) {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          console.log(accounts[0]);
          userAddress = accounts[0];
        }

        const txRes = await contract.getBorrowersList(userAddress);

        txRes.map((offer, i) => {
          element = {
            escrowId: Number(offer.escrowId._hex),
            nftAddress: offer.nftAddress,
            nftId: Number(offer.nftId._hex),
            lender: offer.lender,
            borrower: offer.borrower,
            amount: utils.formatEther(Number(offer.amount._hex).toString()),
            tenure: Number(offer.tenure._hex),
            apy: Number(offer.apy._hex),
            isInsuared: offer.isInsuared,
            accepted: offer.accepted,
          };

          results.push(element);
        });


        setBorrowerList(results);

        console.log("Borrow List📞: ", results);
        return true;
      }
    } catch (error) {
      alert("Fetch listing Err: ", error);
      console.log("Fetch listing Err: ", error);
    }
  };

  useEffect(() => {
    (
      async () => {
        await getBorrowOffers();
      }
    )();
  }, []);


  const listNftToMarketplace = async (_amount, _nftAddress, _nftId, _tenure, _apy) => {
    // address _borrower, uint256 _amount, address _nftAddress, uint256 _nftId, uint256 _tenure, uint256 _apy
    let _borrower;
    try {
      if (window.ethereum) {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const contract = new ethers.Contract(
          gainxContractAddress,
          gainxAbi,
          signer
        );

        if (ethereum.isConnected()) {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          console.log(accounts[0]);
          _borrower = accounts[0];
        }

        _amount = utils.parseEther(_amount); // string
        let listingPrice = utils.parseEther("0.5");

        const txRes = await contract._initEscrow(_borrower, _amount, _nftAddress, _nftId, _tenure, _apy, {
          value: listingPrice,
          gasLimit: 500000000,
        });

        setIsLoading(true);
        await txRes.wait(1);
        setIsLoading(false);

        console.log(txRes);
        return true;
      }
    } catch (error) {
      alert("Error while listing Offer!");
    }
  };

  const acceptOffer = async (_escrowId, _isInsuared) => {
    let txAmount;
    try {
      if (window.ethereum) {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const contract = new ethers.Contract(
          gainxContractAddress,
          gainxAbi,
          signer
        );

        if (ethereum.isConnected()) {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          console.log(accounts[0]);
          // _borrower = accounts[0];
        }

        const res = await contract.idToEscrow(_escrowId); // object --> amount: {_hex: '0x01'}
        txAmount = Number(res.amount._hex); // txAmount = 1 (Number)

        if (_isInsuared == true || _isInsuared === 'true') {
          txAmount += (0.1 * txAmount) // premium amount, 1 + (0.1*1) = 1.1 (Number)
        }

        txAmount = txAmount.toString(); // 1.1 --> '1.1' 
        txAmount = utils.parseEther(txAmount); // '1.1' --> '1.1 * 10^18'

        const txRes = await contract._initEscrow(_escrowId, _isInsuared, {
          value: txAmount, // '1.1 * 10^18'
          gasLimit: 500000000,
        });

        setIsLoading(true);
        await txRes.wait(1);
        setIsLoading(false);

        console.log(txRes);
        return true;
      }
    } catch (error) {
      alert("Error while accepting Offer!");
    }
  };

  const buyInsurance = async (_escrowId) => {
    //msg.sender, currEscrow.amount, _escrowId
    let txAmount;
    let lender;
    try {
      if (window.ethereum) {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const contract = new ethers.Contract(
          gainxContractAddress,
          gainxAbi,
          signer
        );

        if (ethereum.isConnected()) {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          console.log(accounts[0]);
          lender = accounts[0];
        }

        const res = await contract.idToEscrow(_escrowId); // object --> amount: {_hex: '0x01'}
        txAmount = Number(res.amount._hex); // txAmount = 1 (Number)

        txAmount = (0.1 * txAmount) // premium amount, (0.1*1) = 0.1 (Number)

        txAmount = txAmount.toString(); // 0.1 --> '0.1' 
        txAmount = utils.parseEther(txAmount); // '0.1' --> '0.1 * 10^18'

        const txRes = await contract.buyInsurance(_escrowId, {
          value: txAmount, // '0.1 * 10^18'
          gasLimit: 500000000,
        });

        setIsLoading(true);
        await txRes.wait(1);
        setIsLoading(false);

        console.log(txRes);
        return true;
      }
    } catch (error) {
      alert("Error while buying insurance!");
    }
  };

  const repayAmount = async (_escrowId) => {
    let borrower;
    try {
      if (window.ethereum) {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const contract = new ethers.Contract(
          gainxContractAddress,
          gainxAbi,
          signer
        );

        if (ethereum.isConnected()) {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          console.log(accounts[0]);
          borrower = accounts[0];
        }

        const txRes = await contract._receiveRepayAmt(_escrowId, {
          gasLimit: 500000000,
        });

        setIsLoading(true);
        await txRes.wait(1);
        setIsLoading(false);

        console.log(txRes);
        return true;
      }
    } catch (error) {
      alert("Error while repaying amount!");
    }
  };

  const reedemAmount = async (_escrowId) => {
    let lender;
    try {
      if (window.ethereum) {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const contract = new ethers.Contract(
          gainxContractAddress,
          gainxAbi,
          signer
        );

        if (ethereum.isConnected()) {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          console.log(accounts[0]);
          lender = accounts[0];
        }

        const txRes = await contract._receiveReedemAmt(_escrowId, {
          gasLimit: 500000000,
        });

        setIsLoading(true);
        await txRes.wait(1);
        setIsLoading(false);

        console.log(txRes);
        return true;
      }
    } catch (error) {
      alert("Error while redeeming amount!");
    }
  };

  const mintNFT = async () => {
    let receiver;
    try {
      if (window.ethereum) {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const contract = new ethers.Contract(
          nftContractAddress,
          nftAbi,
          signer
        );

        if (ethereum.isConnected()) {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          console.log(accounts[0]);
          receiver = accounts[0];
        }

        let mintingPrice = utils.parseEther("1.0");

        const txRes = await contract.safeMint(receiver, {
          value: mintingPrice,
          gasLimit: 500000000,
        });

        await txRes.wait();

        console.log(txRes);
        return true;
      }
    } catch (error) {
      alert("Error while minting NFT!");
    }
  };

  return (
    <CreateLendContext.Provider
      value={{
        currentAccount,
        setCurrentAccount,
        allListings,
        setAllListings,
        getAllListings,
        myNfts,
        lenderList,
        borrowerList,
        isLoading,
        listNftToMarketplace,
        acceptOffer,
        buyInsurance,
        repayAmount,
        reedemAmount
      }}
    >
      {children}
    </CreateLendContext.Provider>
  );
};

export default CreateLendContext;
