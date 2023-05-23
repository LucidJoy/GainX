import React, { createContext, useState, useEffect } from "react";
import { ethers, utils } from "ethers";
import Web3Modal from "web3modal";
const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");
import { Database } from "@tableland/sdk";
import axios from "axios";


import gainx from "./Gainx.json";
import gainxToken from "./GainxToken.json";
import redeemToken from "./RedeemToken.json";

import { useRouter } from "next/router";

const CreateLendContext = createContext({});

// const gainxContractAddress = "0x513028401543099405cb47bC00788a05d99E91F2";
// const gainxContractAddress = "0x9c88f79eA319B9770125E689F9aeDCE1C0992224"; // 0x7619EcEc5bf84Da954a9A5d52caa4B8dB6313c84 (new)
const gainxContractAddress = "0x7619EcEc5bf84Da954a9A5d52caa4B8dB6313c84"; // 0x7619EcEc5bf84Da954a9A5d52caa4B8dB6313c84 (new)
const gainxTokenContractAddress = "0xd4e6eC0202F1960dA896De13089FF0e4A07Db4E9";
const redeemTokenContractAddress = "0xEC6C1001a15c48D4Ea2C7CD7C45a1c5b6aD120E9";

const gainxAbi = gainx.abi;
const gainxTokenAbi = gainxToken.abi;
const redeemTokenAbi = redeemToken.abi;
let collectionAddress = "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d";
let months = 3;

export const CreateLendProvider = ({ children }) => {
  const route = useRouter();
  const [currentAccount, setCurrentAccount] = useState("");

  const [wishlistForm, setWishlistForm] = useState({
    tenure: "",
    apy: "",
  });
  const [listClicked, setListClicked] = useState(false);
  const [myNftForm, setMyNftForm] = useState({
    nftAddress: "",
    nftId: "",
    chain: "",
    estimatedAmount: "",
    tenure: "",
    apy: "",
  });
  const [allListings, setAllListings] = useState([]);
  const [myNfts, setMyNfts] = useState([]);
  const [lenderList, setLenderList] = useState([]);
  const [borrowerList, setBorrowerList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeObject, setActiveObject] = useState({
    title: "",
    image: "",
    escrowId: "",
    amount: "",
    tenure: "",
    apy: "",
    borrower: "",
    accepted: "",
    isInsuared: "",
    lender: "",
    nftAddress: "",
    nftId: "",
  });
  const [database, setDatabase] = useState();
  const [tablename, setTablename] = useState();
  const [tabledata, setTabledata] = useState({
    key: "",
    value: "",
  });

  async function maketable() {
    const prefix = "demo_table";
    const { meta: create } = await database
      .prepare(`CREATE TABLE ${prefix}(id text, data text);`)
      .run();
    const { name } = create.txn;
    setTablename(name);
    console.log("table", name);
  }

  async function writetable() {
    const { meta: insert } = await database
      .prepare(`INSERT INTO ${tablename} (id, data) VALUES (?, ?);`)
      .bind(parseInt(tabledata?.key), tabledata?.value.toString())
      .run();

    await insert.txn.wait();

    const { results } = await database
      .prepare(`SELECT * FROM ${tablename};`)
      .all();
    console.log(results);
  }

  async function connectDatabase(signer) {
    const db = new Database({ signer });
    return db;
  }

  async function handleConnect() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    setSigner(signer);
    const database = await connectDatabase(signer);
    setDatabase(database);
    console.log(database);
  }

  const [offerId, setOfferId] = useState("");
  let [estAmt, setEstAmt] = useState("");

  const demoItem = {
    escrowId: "0",
    name: "Shiny APE",
    crypto: "40.7826",
    price: 183.5217,
    location: "Bored Ape Yacht Club",
    tenure: "4",
    isInsured: false,
  };

  let offers = ["55.6064", "50.2044", "40.7826", "21.9151"];
  useEffect(() => {
    if (Number(myNftForm.tenure) == 1) {
      console.log("Offer 0");
      setEstAmt(offers[0]);
    } else if (Number(myNftForm.tenure) > 1 && Number(myNftForm.tenure) <= 3) {
      console.log("Offer 1");
      setEstAmt(offers[1]);
    } else if (Number(myNftForm.tenure) > 3 && Number(myNftForm.tenure) <= 6) {
      console.log("Offer 2");
      setEstAmt(offers[2]);
    } else {
      console.log("Offer 3");
      setEstAmt(offers[3]);
    }
  }, [myNftForm.tenure]);

  // AI/ML api integration
  const getNftEstPricesApi = async () => {
    const res = await axios({
      method: "get",
      url: `https://nft-api-ou54.onrender.com/predictions/contract_address=${myNftForm.nftAddress}&no_of_months=${myNftForm.tenure}`,
      withCredentials: false,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
    console.log("Est prices: ", res);
  };

  const trainModelApi = async () => {
    const res = await axios({
      method: "get",
      url: `https://nft-api-ou54.onrender.com/train_model/contract_address=${myNftForm.nftAddress}`,
      withCredentials: false,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
    console.log("Train Model: ", res);
  };

  // useEffect(() => {
  //   (
  //     async () => {
  //       await getNftEstPricesApi();
  //     }
  //   )();
  // }, [])

  const getAllListings = async () => {
    let results = [];
    let element;
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

      const allNFTs = [];

      const chains = [EvmChain.MUMBAI, EvmChain.POLYGON];

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
  };

  // useEffect(() =>
  //   (async () => {
  //     await getMyNfts();
  //   })();
  // }, []);

  const getLendedOffers = async () => {
    let results = [];
    let element;
    let userAddress;

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
      console.log("Lenders txRes: ", txRes);

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
  };

  useEffect(() => {
    (async () => {
      await getLendedOffers();
    })();
  }, []);

  const getBorrowOffers = async () => {
    let results = [];
    let element;
    let userAddress;

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
  };

  useEffect(() => {
    (async () => {
      await getBorrowOffers();
    })();
  }, []);

  // tableland

  const listNftToMarketplace = async ({
    nftAddress,
    nftId,
    chain,
    estimatedAmount,
    tenure,
    apy,
  }) => {
    // address _borrower, uint256 _amount, address _nftAddress, uint256 _nftId, uint256 _tenure, uint256 _apy
    /*
    nftAddress: "",
    nftId: "",
    chain: "",
    estimatedAmount: "",
    tenure: "",
    apy: "",
    */
    let _borrower;

    setTabledata({
      key: nftId,
      value: {
        nftAddress,
        nftId,
        chain,
        estimatedAmount,
        tenure,
        apy,
      },
    });
    handleConnect();
    maketable();
    writetable();

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

        estAmt = utils.parseEther(estAmt); // string
        let listingPrice = utils.parseEther("0.5");

        const txRes = await contract._initEscrow(
          _borrower,
          estAmt,
          nftAddress,
          nftId,
          tenure,
          apy,
          {
            value: listingPrice,
            gasLimit: 500000000,
          }
        );

        setIsLoading(true);
        await txRes.wait(1);
        setIsLoading(false);

        route.push("/marketplace");

        console.log(txRes);
        return true;
      }
    } catch (error) {
      alert("Error while listing Offer!");
    }
  };

  const acceptOffer = async ({ escrowId }) => {
    // const demoItem = {
    //   escrowId: "0",
    //   name: "Shiny APE",
    //   crypto: "40.7826",
    //   price: 183.5217,
    //   location: "Bored Ape Yacht Club",
    //   tenure: "4",
    //   isInsured: false,
    // };
    
    let txAmount, _borrower;
    let _isInsuared = false;
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

        const res = await contract.idToEscrow(escrowId); // object --> amount: {_hex: '0x01'}
        txAmount = Number(res.amount._hex); // txAmount = 1 (Number)

        if (_isInsuared == true || _isInsuared === "true") {
          txAmount += 0.1 * txAmount; // premium amount, 1 + (0.1*1) = 1.1 (Number)
        }

        let txAmt = txAmount.toString(); // 1.1 --> '1.1'
        txAmount = txAmount.toString(); // 1.1 --> '1.1'
        txAmount = utils.parseEther(txAmount); // '1.1' --> '1.1 * 10^18'


        const txRes = await contract._acceptOffer(escrowId, _isInsuared, {
          value: txAmt, // '1.1 * 10^18'
          gasLimit: 500000000,
        });

        setIsLoading(true);
        await txRes.wait(1);
        setIsLoading(false);

        console.log(txRes);
        return true;
      }
    } catch (error) {
      // alert("Error while accepting Offer!");
      console.log("Accept offer", error);
    }
  };

  const buyInsurance = async () => {
    // _escrowId
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

        // const res = await contract.idToEscrow(_escrowId); // object --> amount: {_hex: '0x01'}
        const res = await contract.idToEscrow(offerId); // object --> amount: {_hex: '0x01'}
        txAmount = Number(res.amount._hex); // txAmount = 1 (Number)

        txAmount = 0.1 * txAmount; // premium amount, (0.1*1) = 0.1 (Number)

        let amt = txAmount.toString(); // 0.1 --> '0.1'
        txAmount = txAmount.toString(); // 0.1 --> '0.1'
        txAmount = utils.parseEther(txAmount); // '0.1' --> '0.1 * 10^18'

        console.log("Formatted amount: ", Number(utils.formatEther(txAmount)));

        const txRes = await contract.buyInsurance(lender, txAmount, offerId, {
          value: amt, // '0.1'
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
      console.log(error);
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
        wishlistForm,
        setWishlistForm,
        listClicked,
        setListClicked,
        myNftForm,
        setMyNftForm,
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
        reedemAmount,
        activeObject,
        setActiveObject,
        offerId,
        setOfferId,
        estAmt,
        setEstAmt,
      }}
    >
      {children}
    </CreateLendContext.Provider>
  );
};

export default CreateLendContext;
