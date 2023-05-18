import React, { createContext, useState } from "react";

const CreateLendContext = createContext({});

export const CreateLendProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");

  return (
    <CreateLendContext.Provider value={{ currentAccount, setCurrentAccount }}>
      {children}
    </CreateLendContext.Provider>
  );
};

export default CreateLendContext;
