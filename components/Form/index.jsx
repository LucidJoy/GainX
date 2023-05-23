import React, { useContext, useEffect } from "react";
import styles from "./Form.module.sass";
import cn from "classnames";

import CreateLendContext from "../../context/LendContext";

const Form = ({ profile }) => {
  const {
    wishlistForm,
    setWishlistForm,
    listClicked,
    setListClicked,
    myNftForm,
    setMyNftForm,
    currentAccount,
    listNftToMarketplace,
    estAmt
  } = useContext(CreateLendContext);

  const handleListing = async () => {
    const response = await listNftToMarketplace(myNftForm);
    console.log('Handle listing response: ', response);
  }

  useEffect(() => console.log(myNftForm), [myNftForm]);

  return (
    <div className={styles.list_form}>
      <p style={{ letterSpacing: "0.5px" }}>DETAILS</p>

      <div className={styles.inputs}>
        <div className={styles.input}>
          <p className={styles.label}>NFT Address:</p>
          {profile ? (
            <div>
              <input
                type='text'
                className={styles.prof_input_text}
                placeholder='Enter NFT address'
                id='nftAddress'
                onChange={(e) =>
                  setMyNftForm({ ...myNftForm, nftAddress: e.target.value })
                }
              />
            </div>
          ) : (
            <p className={styles.data}>
              0xb53A165f344827da29f7d489F549a197F18528d1
            </p>
          )}
        </div>

        <div className={styles.input}>
          <p className={styles.label}>NFT Id:</p>
          {profile ? (
            <div>
              <input
                type='number'
                className={styles.prof_input_number}
                placeholder='Enter NFT Id'
                min={0}
                id='nftId'
                onChange={(e) =>
                  setMyNftForm({ ...myNftForm, nftId: e.target.value })
                }
              />
            </div>
          ) : (
            <p className={styles.data}>0001</p>
          )}
        </div>

        <div className={styles.input}>
          <p className={styles.label}>Chain:</p>
          <select
            name='chain'
            id='chain'
            style={{
              borderRadius: "5px",
              padding: "8px",
              backgroundColor: "transparent",
              color: "#fff",
              border: "1px solid #4c5059",
              width: "175px",
              fontWeight: "bold",
            }}
            onChange={(e) =>
              setMyNftForm({ ...myNftForm, chain: e.target.value })
            }
          >
            <option value=''>Select chain</option>
            <option value='fvm'>FVM Hyperspace</option>
            <option value='polygon'>Polygon Mumbai</option>
          </select>
        </div>

        <div className={styles.input}>
          <p className={styles.label}>Owner:</p>

          <p className={styles.data}>
            {currentAccount ? currentAccount : "Connect your wallet"}
          </p>
        </div>

        <div
          className={styles.input}
          style={{
            marginTop: "15px",
            borderTop: "1px solid #4c5059",
            borderBottom: "1px solid #4c5059",
            padding: "8px 0px",
            marginBottom: "15px",
          }}
        >
          <p className={styles.label}>Estimated Amount:</p>
          {/* <input
              type='number'
              id='estimatedAmount'
              className={styles.dataInput}
              onChange={(e) =>
                setMyNftForm({ ...myNftForm, estimatedAmount: e.target.value })
              }
            /> */}
          {profile ? (
            <p>{myNftForm.tenure == '' ? '0' : estAmt}</p>
          ) : (
            <p className={styles.data}>20</p>
          )}
        </div>

        <div className={styles.input}>
          <p className={styles.label}>Tenure (In Months):</p>
          <input
            className={styles.dataInput}
            type='number'
            min={1}
            id='tenure'
            onChange={(e) =>
              profile
                ? setMyNftForm({ ...myNftForm, tenure: e.target.value })
                : setWishlistForm({ ...wishlistForm, tenure: e.target.value })
            }
          ></input>
        </div>

        <div className={styles.input}>
          <p className={styles.label}>APY (in %):</p>
          <input
            className={styles.dataInput}
            type='number'
            min={1}
            id='apy'
            onChange={(e) =>
              profile
                ? setMyNftForm({ ...myNftForm, apy: e.target.value })
                : setWishlistForm({ ...wishlistForm, apy: e.target.value })
            }
          ></input>
        </div>
      </div>

      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        <button
          className={cn("button")}
          style={{ width: "50%", textAlign: "center" }}
          onClick={async () => {
            let response = await handleListing();
            console.log('Response to listing: ', response);
            console.log('List clicked')
          }}
        >
          List
        </button>
      </div>
    </div>
  );
};

export default Form;
