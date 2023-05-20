import React, { createContext, useState } from "react";

const CreateLendContext = createContext({});

export const CreateLendProvider = ({ children }) => {
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
    tenure: "",
    apy: "",
  });

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
      }}
    >
      {children}
    </CreateLendContext.Provider>
  );
};

export default CreateLendContext;
