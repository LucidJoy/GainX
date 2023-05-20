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

const gainxContractAddress = "0x2849CA671e7029BD66Fa119d418a498713927bE7";
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
        borrowerList
      }}
    >
      {children}
    </CreateLendContext.Provider>
  );
};

export default CreateLendContext;
